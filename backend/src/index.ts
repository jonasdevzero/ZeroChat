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
                socket.to(contact).emit("userJoinOrLeft", { userId, status: "join" });
            });

            callback(contactsOnline);
        });

        socket.on("sendPrivateMessage", ({ message, unread_messages }, callback) => {
            io.to(message.sender_id).to(message.contact.id).emit("privateMessage", { message, unread_messages });

            callback();
        });

        socket.on("sendGroupMessage", ({ message, from, to }, callback) => {
            io.to(to).emit("groupMessage", { message, from, to });

            callback();
        });

        socket.on("disconnect", () => {
            const disconnectedUser = users.find(user => user.socketId === socket.id);
            users = users.filter(user => user?.id !== disconnectedUser?.id ? user : null);

            console.log(`user disconnected: ${disconnectedUser?.id}`);

            disconnectedUser?.contacts.forEach(contact => {
                socket.to(contact).emit("userJoinOrLeft", { userId: disconnectedUser.id, status: "left" });
            });
        });
    });

    app.use(cors());
    app.use(express.json());
    app.use(routes);

    server.listen(PORT, () => console.log(`Running the server on port: ${PORT}, with the cluster worker: ${cluster.worker.id}`));
};
