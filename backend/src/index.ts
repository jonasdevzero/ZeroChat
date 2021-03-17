import "dotenv";
import "./database";
import express from 'express';
import { Server } from 'http';
import socketio from 'socket.io';
import cors from 'cors';
import cluster from "cluster";
import { cpus } from "os";
import routes from './routes';
import path from "path";
import socketConnection from "./socket";

const app = express();
const server = new Server(app);
const io = new socketio.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const numCPUs = cpus().length;
const PORT = process.env.PORT || 3001;

if (cluster.isMaster) {
    for (let index = 0; index < numCPUs; index++) {
        cluster.fork();
    };

    cluster.on("exit", (worker) => {
        console.log(`Process ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    socketConnection(io);

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
    app.use(routes);

    server.listen(PORT, () => console.log(`Running the server on port: ${PORT}, with the cluster worker: ${cluster.worker.id}`));
};
