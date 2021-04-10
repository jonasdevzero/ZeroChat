interface UserI {
    id: string
    socketId: string
    contacts: string[]
}

class Users {
    #users: UserI[] = []

    constructor() { }

    findOne(id: string) {
        let user 

        for (const u of this.#users) {
            if (u.id !== id || u.socketId !== id) continue;
            user = u
        }
            
        return user
    }

    push(data: UserI) {
        this.#users.push(data)
    }

    remove(socketId: string) {
        this.#users.filter(u => u.socketId !== socketId)
    }

    isOnline(id: string) {
        return !!this.findOne(id) 
    }

    getUsersIdOnline(ids: string[]) {
        let usersOnline: string[] = [] 

        for (const id of ids) {
            this.isOnline(id) ? usersOnline.push(id) : null            
        }

        return usersOnline
    }

    pushNewContact(id: string, contactId: string) {
        this.#users.map(user => {
            if (user.id === id || user.socketId === id) {
                user.contacts.push(contactId)
            }

            return user
        })
    }
}

export default Users 
