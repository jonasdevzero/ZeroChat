import { api, socket, socketEmit } from '..'
import { socketEvents } from '../socket/socketEvents'
import Cookies from 'js-cookie'
import UserService from '../../types/services/userService'
import { User } from '../../types/user'
import { updateRoom, removeRoom } from '../../store/actions/user'
import store from '../../store'

export default {
    connect() {
        return new Promise((resolve, reject) => {
            try {
                const jwt = Cookies.get('token')
                if (!jwt) reject('Unounterized');

                socket.io.opts.query = `token=Bearer ${jwt}`
                socket.connect()

                socket.once('ready', (user: User) => {
                    if (!user) {
                        Cookies.remove('token')
                        reject('Token invalid or expired!')
                    }

                    api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`

                    socketEvents()
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

                Cookies.set('token', token, { expires: rememberMe ? 1 : undefined })
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
                reject(error?.response?.data?.message || error)
            }
        })
    },

    update(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.put('/user', data)
                const { name, username } = response.data

                const id = store.getState().user.id
                socketEmit.update(updateRoom({ where: id, set: { name, username }, roomType: 'contact' }), () => { resolve({ name, username }) })
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
                const { location } = response.data

                const id = store.getState().user.id
                socketEmit.update(updateRoom({ where: id, set: { picture: location }, roomType: 'contact' }), () => { resolve(response.data) })
            } catch (error) {
                reject(error)
            }
        })
    },

    updateEmail({ email, password }) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.patch('/user/email', { email, password })
                resolve(response.data)
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

    delete(password) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.post('/delete', { password })

                const id = store.getState().user.id
                socket.emit('update', removeRoom({ roomType: 'contact', roomId: id }), () => { resolve('ok') })
            } catch (error) {
                reject(error)
            }
        })
    },

    restore(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.post('/restore', { username, password })
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },
} as UserService
