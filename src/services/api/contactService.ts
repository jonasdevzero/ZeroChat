import { api, socket } from ".."
import ContactService from '../../types/services/contactService'
import { pushData } from '../../store/actions/user'

export default {
    search(username) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!username.trim()) resolve([])

                const response = await api.get(`/user/search?username=${username}`)
                const { user } = response.data

                resolve(user)
            } catch (error) {
                reject(error)
            }
        })
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
                const { data } = await api.post(`/contact/invite/${contact_id}`)
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

                socket.emit('invite-accepted', contact.id, (_error: any,  isOnline: boolean) => {
                    contact.online = isOnline
                    resolve(contact)
                })
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
