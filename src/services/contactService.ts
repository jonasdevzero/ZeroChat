import { api } from "."
import ContactService from '../types/services/contactService'

export default {
    invite(contact_id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.post('/contact/invite', { contact_id })
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },

    acceptInvite(invitation_id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.post('/contact/invite', { invitation_id })
                const { contact } = response.data

                resolve(contact)
            } catch (error) {
                reject(error)
            }
        })
    },

    refuseInvite(invitation_id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve('ok')
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
