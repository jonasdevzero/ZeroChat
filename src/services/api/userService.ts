import { api, socket } from '..'
import Cookies from 'js-cookie'
import UserService from '../../types/services/userService'
import { UserI } from '../../types/user'
import { updateRoom, removeRoom } from '../../store/actions/user'

export default {
    connect() {
        return new Promise((resolve, reject) => {
            try {
                const jwt = Cookies.get('token')
                if (!jwt) reject('Unounterized');

                socket.io.opts.query = `token=Bearer ${jwt}`
                socket.connect()

                socket.once('ready', (user: UserI) => {
                    if (!user) {
                        Cookies.remove('token')
                        reject('Token invalid or expired!')
                    }

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
                reject(error)
            }
        })
    },

    update(id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.put('/user', data)
                const { name, username } = response.data

                socket.emit('update', updateRoom({ where: id, set: { name, username }, roomType: 'contact' }), () => { resolve({ name, username }) })
            } catch (error) {
                reject(error)
            }
        })
    },

    updatePicture(id, picture) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = new FormData()
                data.append('picture', picture)

                const response = await api.patch('/user/picture', data)
                const { location } = response.data

                socket.emit('update', updateRoom({ where: id, set: { picture: location }, roomType: 'contact' }), () => { resolve(response.data) })
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

    delete(id, password) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.post('/delete', { password })
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
