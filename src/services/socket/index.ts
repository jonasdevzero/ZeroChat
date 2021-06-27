import io from "socket.io-client"

const URL = 'https://zero-websocket-test.herokuapp.com'

const socket = io(URL, {
    autoConnect: false,
    transports: ['websocket']
})

export default socket
