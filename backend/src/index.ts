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

io.on('connection', (socket: socketio.Socket) => {
    socket.on("start", (rooms: string[], callback) => {
        if (rooms) {
            console.log(`user: ${rooms[0]} is online`);
            socket.join(rooms);
        };

        callback();
    });

    socket.on("sendPrivateMessage", (message, callback) => {
        io.to(message.sender_id).to(message.contact.contact_id).emit("privateMessage", message);

        callback();
    });

    socket.on("sendGroupMessage", ({ message, from, to }, callback) => {
        io.to(to).emit("groupMessage", { message, from, to });

        callback();
    });
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(PORT, () => console.log("Server running -> " + PORT));
