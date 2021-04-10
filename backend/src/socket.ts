import { Server, Socket } from "socket.io";
import SessionUser from "./session/users";

interface OnGroupI {
    groupId?: string;
    event: "new" | "update" | "join";
    data: { [key: string]: any };
};

interface OnUserI {
    contactId?: string;
    event: "update" | "addContact";
    data: { [key: string]: any };
};

export default function socketConnection(io: Server) {
    io.on("connection", (socket: Socket) => {
        socket.on("join", ({ rooms, contacts }, callback) => {
            socket.join(rooms);
            const userId = rooms[0];

            SessionUser.create({ id: userId, socketId: socket.id, contacts });
            const contactsOnline = SessionUser.getContactsOnline(contacts);

            console.log(`user connected: ${userId}`);

            contactsOnline.forEach(contact => socket.to(contact).emit("user", { event: "update", data: { where: userId, set: { online: true } } }));

            callback(contactsOnline);
        });

        socket.on("private-message", (message, callback) => {
            io.to(message.sender_id).to(message.contact.id).emit("private-message", message);
            callback();
        });

        socket.on("group-message", (message, callback) => {
            io.to(message.group_id).emit("group-message", message);
            callback();
        });

        socket.on("user", ({ event, data, contactId }: OnUserI, callback) => {
            const user = SessionUser.findOne(socket.id);
            if (!user) return;

            const contactsOnline = SessionUser.getContactsOnline(user.contacts || []);

            switch (event) {
                case "addContact":
                    if (contactId) {
                        SessionUser.pushNewContact(socket?.id, contactId);
                        callback(SessionUser.findOne(contactId) ? true : false);
                    };
                    break;
                case "update":
                    const { where, set } = data;
                    contactsOnline.forEach(c => socket.to(c).emit("user", { event, data: { where, set } }));
                    break;
            };
        });

        socket.on("call-request", (data, callback) => {
            const user = SessionUser.findOne(socket.id);
            socket.to(data.to).emit("call-request", { signal: data.signal, callFrom: user?.id, callType: data.callType });

            callback();
        });

        socket.on("call-answer", data => {
            socket.to(data.to).emit("call-accepted", data.signal);            
        });

        socket.on('call-rejected', ({ to }, callback) => {
            socket.to(to).emit('call-rejected');

            callback();
        });

        socket.on('call-finished', ({ to }, callback) => {
            socket.to(to).emit('call-finished');

            callback();
        })

        socket.on("group", ({ groupId, event, data }: OnGroupI, callback) => {
            switch (event) {
                case "new":
                    data.members.forEach((c: string) => socket.to(c).emit("group", data));
                    break;
                case "join":
                    if (groupId) socket.join(groupId);
                    break;
            };

            callback();
        });

        socket.on("disconnect", () => {
            const disconnectedUser = SessionUser.findOne(socket.id);

            if (disconnectedUser) {
                const { id, contacts } = disconnectedUser;
                SessionUser.remove(socket.id);

                console.log(`user disconnected: ${id}`);

                const contactsOnline = SessionUser.getContactsOnline(contacts)
                contactsOnline.forEach(contact => socket.to(contact).emit("user", { event: "update", data: { where: id, set: { online: false } } }));
            };
        });
    });
};
