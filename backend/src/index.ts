import "dotenv";
import "./database";
import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import cors from 'cors';
import cluster from "cluster";
import { cpus } from "os";
import routes from './routes';

const app = express();
const server = new Server(app);
const io = new socketio.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const numCPUs = cpus().length;
const PORT = process.env.PORT || 3001;

let users: Array<{
    id: string;
    socketId: string;
    contacts: string[]
}> = [];

if (cluster.isMaster) {
    for (let index = 0; index < numCPUs; index++) {
        cluster.fork();
    };

    cluster.on("exit", (worker) => {
        console.log(`Process ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    io.on('connection', (socket: socketio.Socket) => {
        socket.on("join", ({ rooms, contacts }, callback) => {
            socket.join(rooms);
            const userId = rooms[0];

            users.push({
                id: userId,
                socketId: socket.id,
                contacts
            });

            let contactsOnline: string[] = [];

            contacts.forEach((contact: string) => {
                users.find(user => user.id === contact) ? contactsOnline.push(contact) : null
            });

            console.log(`user connected: ${userId}`);

            contacts.forEach((contact: string) => {
                socket.to(contact).emit("contact-status-change", { contact_id: userId, status: "online" });
            });

            callback(contactsOnline);
        });

        socket.on("private-message", ({ message, unread_messages }, callback) => {
            io.to(message.sender_id).to(message.contact.id).emit("private-message", { message, unread_messages });

            callback();
        });

        socket.on("group-message", ({ message, from, to }, callback) => {
            io.to(to).emit("group-message", { message, from, to });

            callback();
        });

        socket.on("is-online", (contactId, callback) => {
            const online = users.find(u => u.id === contactId) ? true : false;

            callback(online);
        });

        socket.on("disconnect", () => {
            const disconnectedUser = users.find(user => user.socketId === socket.id);
            users = users.filter(user => user?.id !== disconnectedUser?.id ? user : null);

            console.log(`user disconnected: ${disconnectedUser?.id}`);

            disconnectedUser?.contacts.forEach(contact => {
                socket.to(contact).emit("contact-status-change", { contact_id: disconnectedUser.id, status: "offline" });
            });
        });
    });

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(routes);

    server.listen(PORT, () => console.log(`Running the server on port: ${PORT}, with the cluster worker: ${cluster.worker.id}`));
};
