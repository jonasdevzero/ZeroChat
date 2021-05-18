import { api, socket } from '.'
import Cookies from 'js-cookie'
import UserService from '../types/services/userService'
import { UserI } from '../types/user'

export default {
    auth() {
        return new Promise(async (resolve, reject) => {
            try {
                const jwt = Cookies.get('token')
                if (!jwt) throw new Error('Unounterized');

                socket.connect()

                socket.once('ready', (user: UserI) => {
                    if (!user) reject('Cannot connect to the server!');

                    api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`
                    resolve(user)
                })
            } catch (error) {
                Cookies.remove('token')
                reject(error)
            }
        })
    },

    login({ reference, password, rememberMe }) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.post('/user/login', { reference, password })
                const { token } = response.data

                Cookies.set('token', token, { expires: rememberMe ? undefined : 1 })
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },

    subscribe(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.post('/user', data)
                const { token } = response.data

                Cookies.set('token', token)
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },

    update(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.put('/user', data)
                const { id, name, username } = response.data

                socket.emit('update', { action: 'UPDATE_ROOM', where: id, set: { name, username }, roomType: 'contact' }, () => resolve({ name, username }))
            } catch (error) {
                reject(error)
            }
        })
    },

    updatePicture(picture) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = new FormData()
                data.append('picture', picture)

                const response = await api.patch('/user/picture', data)
                const { id, location } = response.data

                socket.emit('update', { action: 'UPDATE_ROOM', where: id, set: { picture: location }, roomType: 'contact' }, () => resolve(response.data))
            } catch (error) {
                reject(error)
            }
        })
    },

    updateEmail({ email, password }) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.patch('/user/email', { email, password })
                return response.data
            } catch (error) {
                reject(error)
            }
        })
    },

    forgotPassword(email) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.post('/user/forgot_password', { email })
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },

    resetPassword(data) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.post('user/reset_password', data)
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },

    clearNotifications() {

    },
} as UserService
