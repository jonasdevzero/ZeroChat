import { ContactI } from '../types/user';
import api from './api';
import socket from './socket';
import Cookies from 'js-cookie';

interface ServiceConfig {
    body: object | FormData | {}
    query: string | object | {}
    headers: object | {}
    params: object | {}
}

interface LoginI extends ServiceConfig {
    body: {
        email: string
        password: string
    }
}

interface SubscribeI extends ServiceConfig {
    body: {
        name: string
        username: string
        email: string
        password: string
        confirmPassword: string
    }
}

export default {
    async auth() {
        try {
            const { data: { user, token } } = await api.post(`/user/auth`)

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            Cookies.set('token', token)

            return user;
        } catch (error) {
            Cookies.remove('token')
            throw new Error(error);
        }
    },

    async login({ body }: LoginI) {
        const { data: { token } } = await api.post('/user/login', body)

        Cookies.set('token', token)
    },

    async subscribe({ body }: SubscribeI) {
        const { data: { token } } = await api.post('/user', body)
        Cookies.set('token', token)
    },

    async update(data: { name, username }) {
        const response = await api.put('/', data)

    },

    async updatePicture() {

    },

    async searchUsers({ username }) {
        const response = await api.get(`/user?username=${username}`);

        return response.data.contacts;
    },
};
