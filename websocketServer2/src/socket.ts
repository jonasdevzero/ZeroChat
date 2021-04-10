import http from 'http'
import { v4 as uuidV4 } from 'uuid'

class WebSocketServer {
    port: string | number;
    
    constructor({ port }) {
        this.port = port
    }

    emit(socket, event, message) {
        const data = JSON.stringify({ event, message })
        socket.write(`${data}\n`)
    }

    async initialize(eventEmitter) {
        const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end('hey there!')
        })

        server.on('upgrade', (req, socket) => {
            socket.id = uuidV4()
            socket.rooms = []
            const headers = [
                'HTTP/1.1 101 Web Socket Protocol Handshake',
                'Upgrade: WebSocket',
                'Connection: Upgrade',
                ''
            ].map(line => line.concat('\r\n')).join('')

            socket.write(headers)
            eventEmitter.send('CONNECTION', socket)
        })

        return await new Promise((resolve, reject) => {
            server.on('error', reject)
            server.listen(this.port, () => resolve(server))
        })
    }
}

export default WebSocketServer
