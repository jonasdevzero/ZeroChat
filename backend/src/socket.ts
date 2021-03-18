import { Server, Socket } from "socket.io";
import SessionUser from "./session/users";

export default function socketConnection(io: Server) {
    io.on("connection", (socket: Socket) => {
        socket.on("join", ({ rooms, contacts }, callback) => {
            socket.join(rooms);
            const userId = rooms[0];

            SessionUser.create({ id: userId, socketId: socket.id, contacts });
            const contactsOnline = SessionUser.getContactsOnline(contacts);

            console.log(`user connected: ${userId}`);

            contactsOnline
                .forEach(contact => socket.to(contact).emit("contact-status-change", { contact_id: userId, status: "online" }) );

            callback(contactsOnline);
        });

        socket.on("private-message", ({ message }, callback) => {
            io.to(message.sender_id).to(message.contact.id).emit("private-message", { message });

            callback();
        });

        socket.on("group-message", ({ message }, callback) => {
            io.to(message.group_id).emit("group-message", { message });

            callback();
        });

        socket.on("is-online", (contactId, callback) => {
            const online = Boolean(SessionUser.findOne(contactId));

            callback(online);
        });

        socket.on("disconnect", () => {
            const disconnectedUser = SessionUser.findOne(socket.id);

            if (disconnectedUser) {
                const { id, contacts } = disconnectedUser;
                SessionUser.remove(socket.id);

                console.log(`user disconnected: ${id}`);

                SessionUser.getContactsOnline(contacts)
                    .forEach(contact => socket.to(contact).emit("contact-status-change", { contact_id: id, status: "offline" }) );
            };
        });
    });
};
