import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import routes from './routes';

const app = express();
const server = new Server(app);
const io = new socketio.Server(server)

const PORT = process.env.PORT || 3001;

io.on('connection', (socket: socketio.Socket) => {
    console.log("New Connetion!");
    console.log(socket.id);
});

app.use(routes);

server.listen(PORT, () => console.log("Server running -> " + PORT));
