import { api, socket } from ".."
import ContactService from '../../types/services/contactService'
import { pushData } from '../../store/actions/user'

export default {
    async search(username) {
        try {
            if (!username.length) return undefined;

            const response = await api.get(`/user/search?username=${username}`)
            const { user } = response.data

            return user
        } catch (error) {
            throw new Error(error)
        }
    },

    show(contact_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await api.get(`/contact/${contact_id}`)
                const { contact } = data
                resolve(contact)
            } catch (error) {
                reject(error)
            }
        })
    },

    invite(contact_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await api.post('/contact/invite', { contact_id })
                const { invite } = data
                socket.emit('invite', pushData(invite, 'invitations'), () => { resolve('Invite sent') })
            } catch (error) {
                reject(error)
            }
        })
    },

    acceptInvite(invitation_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await api.post(`/contact/invite/accept/${invitation_id}`)
                const { contact } = data

                socket.emit('invite-accepted', contact.id, () => { resolve(contact) })
            } catch (error) {
                reject(error)
            }
        })
    },

    refuseInvite(invitation_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.post(`/contact/invite/refuse/${invitation_id}`)
                resolve('Invite refused')
            } catch (error) {
                reject(error)
            }
        })
    },

    update({ contactId, action }) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.put(`/contact/${contactId}?action=${action}`)

                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },
} as ContactService
