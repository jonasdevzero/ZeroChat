import { api, socket } from '.'
import Cookies from 'js-cookie'
import UserService from '../types/services/userService'
import { UserI } from '../types/user'

export default {
    async index(username) {
        try {
            const response = await api.get(`/user?username=${username}`)
            const { user } = response.data

            return user
        } catch (error) {
            throw new Error(error)
        }
    },

    auth() {
        return new Promise(async (resolve, reject) => {
            try {
                const jwt = Cookies.get('token')
                if (!jwt) throw new Error('Unounterized');

                socket.connect()

                socket.once('ready', (error: any, user: UserI) => {
                    if (error) reject(error);

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

    update({ name, username }) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.put('/user', { name, username })
                return response.data
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
                resolve(response.data)
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
