import { api, socketEmit } from ".."
import GroupService from '../../types/services/groupService'
import * as UserActions from '../../store/actions/user'

interface CreateGroupI {
    name: string
    description: string
    picture: File | undefined
    members: string[]
}

export default {
    show(groupId) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await api.get(`/group/${groupId}`)
                const { group } = data

                resolve(group)
            } catch (error) {
                reject(error)
            }
        })
    },

    create({ name, description, picture, members }: CreateGroupI) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = new FormData()
                data.append('name', name)
                data.append('description', description)
                picture ? data.append('picture', picture) : null

                for (const member of members) data.append('members', member);

                const response = await api.post('/group', data)
                const { group } = response.data

                socketEmit.newGroup({ group, members }, () => { resolve(group) })
            } catch (error) {
                reject(error?.response?.data?.message)
            }
        })
    },

    update({ groupId, name, description }) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await api.put(`/group`, { name, description, group_id: groupId })
                socketEmit.update(UserActions.updateRoom({ where: groupId, set: data, roomType: 'group' }), () => { resolve(data) })
            } catch (error) {
                reject(error)
            }
        })
    },

    updatePicture({ groupId, picture }) {
        return new Promise(async (resolve, reject) => {
            try {
                const formData = new FormData()
                picture ? formData.append('picture', picture) : null
                formData.append('group_id', groupId)

                const { data } = await api.patch('/group/picture', formData)
                const { location } = data

                socketEmit.update(UserActions.updateRoom({ where: groupId, set: { picture: location }, roomType: 'group' }), () => { resolve(location) })
            } catch (error) {
                reject(error)
            }
        })
    },

    delete(groupId) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.delete(`/group/${groupId}`)
                socketEmit.update(UserActions.removeRoom({ roomId: groupId, roomType: 'group' }), () => { resolve('ok') })
            } catch (error) {
                reject(error)
            }
        })
    },

    getUsers(groupId) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await api.get(`/group/users/${groupId}`)
                const { users } = data

                resolve(users)
            } catch (error) {
                reject(error)
            }
        })
    },

    addMember(group_id, member_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await api.post('/group/users', { group_id, member_id })
                const { users: user } = data

                socketEmit.update(UserActions.pushGroupUser(group_id, user), () => { resolve(user) })
            } catch (error) {
                reject(error)
            }
        })
    },

    updateMember(group_id, member_id, role) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.patch('/group/users/role', { group_id, member_id, role })

                socketEmit.update(UserActions.updateGroupUser(group_id, member_id, { role }), () => { resolve('ok') })
            } catch (error) {
                reject(error)
            }
        })
    },

    removeMember(group_id, member_id) {
        return new Promise(async (resolve, reject) => {
            try {
                await api.put('/group/users', { group_id, member_id })

                socketEmit.update(UserActions.removeGroupUser(group_id, member_id), () => { resolve('ok') })
            } catch (error) {
                reject(error)
            }
        })
    },
} as GroupService
