import Event from 'events'
import WebSocketServer from './socket.js'
import WebSocketController from './controller.js'

const port = process.env.PORT || 8080
const eventEmitter = new Event()

const webSocketServer = new WebSocketServer({ port })
console.log('Socket server is running at', port)

const webSocketController = new WebSocketController({ webSocketServer })
eventEmitter.on('CONNECTION', webSocketController.onNewConnection.bind(webSocketController))
