import WebSocketServer from "./socket"

class WebSocketController {
    private webSocketServer: WebSocketServer

    constructor({ webSocketServer }: { webSocketServer: WebSocketServer }) {
        this.webSocketServer =  webSocketServer
    }

    onNewConnection(socket: any) {
        const { id } = socket 
        console.log('connection stablished with', id)

        socket.on('data', this.onSocketData(id))
        socket.on('error', () => { })
        socket.on('end', () => { })

    }

    private onSocketData(id: string) {
        return (data: any) => {
            try {
                const { event, message } = JSON.parse(data)
                this[event](id, message)
            } catch (error) {
                console.error('Wrong event format')
            }
        }
    }

    join(socketId, data) {
        const { rooms, contacts } = data

        
    }
}

export default WebSocketController
