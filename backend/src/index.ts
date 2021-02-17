import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import "dotenv";
import "./database"
import routes from './routes';
import cors from 'cors';

const app = express();
const server = new Server(app);
const io = new socketio.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
})

const PORT = process.env.PORT || 3001;

interface User {
    id: string;
    name: string;
    room: string;
};

let users: User[] = []

io.on('connection', (socket: socketio.Socket) => {
    socket.on("join", ({ name, room }, callback) => {
        if (room) {
            users.push({ name: name, room, id: socket.id })

            console.log(`user: ${name}, [Join] the room: ${room}`);
            socket.join(room);
        };

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = users.find(user => user.id === socket.id);
        if (!user) return;

        io.to(user.room).emit("message", message);

        callback();
    });

    socket.on("leave", () => {
        const user = users.find(user => user.id === socket.id);
        if (!user) return;

        console.log(`user: ${user.name}, [leave] the room: ${user.room}`);
        socket.leave(user.room);
    });
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(PORT, () => console.log("Server running -> " + PORT));
