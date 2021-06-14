import { api } from '../'
import NotificationsService from '../../types/services/notificationsService'

export default {
    get() {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await api.get('/notifications')
                const { notifications } = data

                resolve(notifications)
            } catch (error) {
                reject(error)
            }
        })
    },

    clear() {
        return new Promise(async (resolve, reject) => {
            try {
                await api.put('/notifications/clear')
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },
} as NotificationsService
