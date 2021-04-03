import io from "socket.io-client";

const URL = 'https://back-zerochat.herokuapp.com';

const socket = io(URL, {
    autoConnect: false,
    transports: ['websocket']
});

export default socket;
