import { api, socket } from "."
import MessagesService from '../types/services/messageService'

export default {
    get({ roomType, roomId }) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.get(`/${roomType}/messages/${roomId}`)
                const { messages } = response.data

                resolve(messages)
            } catch (error) {
                reject(error)
            }
        })
    },

    create({ roomType, to, text, medias }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!text.trim() || !medias.length) reject(null);

                const multipartData = new FormData()
                multipartData.append('text', text),
                multipartData.append('to', to)

                for (const media of medias) multipartData.append('medias', media)

                const response = await api.post(`/${roomType}/messages`, multipartData)
                const data = response.data

                const where = roomType === 'contact' ? [data.message.sender_id, data.to] : data.to

                socket.emit('message', { type: 'PUSH_MESSAGE', where, data, roomType }, () => resolve('ok'))
            } catch (error) {
                reject(error)
            }
        })
    },

    viewed({ roomType, roomId }) {
        return new Promise((resolve, reject) => {
            try {
                api.patch(`/${roomType}/messages/viewed/${roomId}`).then(() => resolve('ok'))
            } catch (error) {
                reject(error)
            }
        })
    },

    remove(type, { messageId, d }) {
        return new Promise((resolve, reject) => {
            try {
                const path = `/${type}/messages/${messageId}`
                type === 'contact' ? path.concat(`?d=${d}`) : null

                api.delete(path).then(() => resolve('ok'))
            } catch (error) {
                reject(error)
            }
        })
    },
} as MessagesService
