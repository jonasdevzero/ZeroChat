import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
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
    socket.on("join", (room, callback) => {
        console.log(room);
        socket.join(room);

        callback();
    });

    socket.on("sendMessage", ({ message, room }, callback) => {
        io.to(room).emit("message", message);

        callback();
    });
});

app.use(cors());
app.use(routes);

server.listen(PORT, () => console.log("Server running -> " + PORT));
