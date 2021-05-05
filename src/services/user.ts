import { api, socket } from './'
import Cookies from 'js-cookie';

export default {
    async auth(jwt: string) {
        try {
            const { data: { user, token } } = await api.get(`/user/auth`, { headers: { authorization: `Bearer ${jwt}` } })

            api.defaults.headers.common["Authorization"] = `Bearer ${token}`
            Cookies.set('token', token)

            socket.connect()

            return user;
        } catch (error) {
            Cookies.remove('token')
            throw new Error(error)
        }
    },
};
