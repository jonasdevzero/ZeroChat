import http from 'http';
import socketio from 'socket.io';
import SocketConnection from './socket';
import { cpus } from 'os';
import cluster from 'cluster';
import Users from './users';

const PORT = process.env.PORT || 3002;
const numCPUs = cpus().length;
const users = new Users();

function handle(_req: http.IncomingMessage, res: http.ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write(JSON.stringify({ message: 'Connection stablished!' }));
    
    return res.end();
};

// test

const server = http.createServer(handle);
const io = new socketio.Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    };

    cluster.on('exit', (worker) => {
        console.log(`Process ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const socketConnection = new SocketConnection(io)
    socketConnection.initialize(users)
    
    server.listen(PORT, () => console.log(`Socket server listen on port: ${PORT}`));
};
