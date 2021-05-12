import { api, socket } from "."
import MessagesService from '../types/services/messageService'

export default {
    create({ type, to, text, medias }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!text.trim() || !medias.length) reject('No have data to send!');

                const data = new FormData()
                data.append('text', text),
                data.append('to', to)

                for (const media of medias) data.append('medias', media)

                const response = await api.post(`/${type}/messages`, { text, to, medias })

                socket.emit(`${type}-message`, response.data, () => resolve('ok'))
            } catch (error) {
                reject(error)
            }
        })
    },

    remove(type, { messageId, d }) {
        return new Promise(async (resolve, reject) => {
            try {
                const path = `/${type}/messages/${messageId}`

                if (type === 'contact') path.concat(`?d=${d}`)

                await api.delete(path)
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },
} as MessagesService
