import { api, socket } from ".."
import GroupService from '../../types/services/groupService'

interface CreateGroupI {
    name: string
    description: string
    picture: File
    members: string[]
}

export default {
    create({ name, description, picture, members }: CreateGroupI) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = new FormData()
                data.append('name', name)
                data.append('description', description)
                data.append('picture', picture)

                for (const member of members) data.append('members', member)

                const response = await api.post('/group', data)
                const { group } = response.data

                socket.emit('new-group', { group, members }, () => resolve(group))
            } catch (error) {
                reject(error)
            }
        })
    },

    update({ groupId, name, description }) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api.put(`/group`, { name, description, group_id: groupId })
                resolve(response.data)
            } catch (error) {
                reject(error)
            }
        })
    },

    updatePicture({ groupId, picture }) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = new FormData()
                data.append('picture', picture)
                data.append('group_id', groupId)

                const response = await api.patch('/group/picture')
                resolve(response.data)
            } catch (error) {
                reject(error)
            }
        })
    },

    delete(groupId) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.delete(`/group/${groupId}`)
                socket.emit('update', { type: 'REMOVE_ROOM', roomType: 'group', roomId: groupId }, () => { resolve('ok') })
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },

    addMember({ groupId, memberId }) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },

    updateMember({ groupId, memberId }) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },

    removeMember({ groupId, memberId }) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve('ok')
            } catch (error) {
                reject(error)
            }
        })
    },
} as GroupService
