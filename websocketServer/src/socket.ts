import { Socket, Server } from 'socket.io';
import Users from './users';

class SocketConnection {
    #io: Server
    #users: Users

    constructor(io: Server) { 
        this.#io = io
        this.#users = new Users()
    }

    initialize(users: Users) {
        this.#users = users

        this.#io.on('connection', (socket: Socket) => {
            socket.on('join', ({ rooms, contacts }, callback) => {
                socket.join(rooms)
                const userId = rooms[0]

                this.#users.push({ id: userId, socketId: socket.id, contacts })
                const contactsOnline = this.#users.getUsersIdOnline(contacts)

                for (let contact of contactsOnline) {
                    socket.to(contact).emit('user', { event: 'update', where: userId, set: { online: true } })
                }

                callback(contactsOnline)
            })

            socket.on('message', ({ event, message }, callback) => {
                switch (event) {
                    case 'private': 
                        socket.to(message.sender_id).to(message.receiver_id).emit('message', { event, message })
                        break 
                    case 'group':
                        socket.to(message.group_id).emit('message', { event, message })
                }

                callback()
            })

            socket.on('user', ({ event, data }, callback) => {            
                switch (event) {
                    case 'NEW_CONTACT': 
                        this.#users.pushNewContact(socket.id, data.contactId)
                        callback(this.#users.isOnline(data.contactId))
                        break 
                    case 'UPDATE': 
                        const user = this.#users.findOne(socket.id)
                        const contactsOnline = this.#users.getUsersIdOnline(user?.contacts || [])

                        for (const contact of contactsOnline) {
                            socket.to(contact).emit('user', { event, data })
                        }
                }
            })

            socket.on('group', ({ event, data }, callback) => {
                switch (event) {
                    case 'join': 
                        socket.join(data.groupId)
                        break 
                    case 'new':
                        for (const member of data.members) {
                            socket.to(member).emit('group', data)
                        }
                }

                callback()
            })

            socket.on('call', (data, callback) => {
                socket.to(data.to).emit(data.event, data)
                callback()
            })

            socket.on('disconnect', () => {
                const disconnectedUser = this.#users.findOne(socket.id)

                if (!disconnectedUser) return;

                const { id, contacts } = disconnectedUser
                this.#users.remove(socket.id)

                const contactsOnline = this.#users.getUsersIdOnline(contacts)
                for (let contact of contactsOnline) {
                    socket.to(contact).emit('user', { event: 'update', where: id, set: { online: false } })
                }
            })
        })
    }
}

export default SocketConnection
