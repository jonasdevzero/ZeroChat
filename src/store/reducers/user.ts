import { Contact, Group, User } from "../../types/user"
import { roomUtil } from "../../utils"

const INITIAL_STATE = {
    name: '',
    username: '',
    picture: '',
    email: '',
    contacts: [],
    groups: [],
    notifications: [],
    invitations: []
} as unknown as User

export default function userReducer(state = INITIAL_STATE, action: any) {
    action.roomType ? action.roomType = `${action.roomType}s` : null

    const reducer = reducers[action.type]
    if (!reducer) return state;

    return reducer(state, action)
}

const reducers = {
    'SET_USER'(_state: User, action: any) {
        return action.user
    },

    'UPDATE_USER'(state: User, action: any) {
        const { set } = action

        const setKeys = Object.keys(set)
        const allowUpdate = ['name', 'username', 'email', 'picture']
        setKeys.filter(key => allowUpdate.includes(key))

        const data: { [key: string]: any } = {}
        for (const key of setKeys) data[key] = set[key]

        return { ...state, ...data }
    },

    'UPDATE_ROOM'(state: User, action: any) {
        const { where, set, roomType } = action
        if (!where || !set || !roomType) return state;

        const rooms = state[roomType]
        if (!rooms) return state;

        const whereIsArray = Array.isArray(where)
        const allowUpdate = {
            contacts: ['name', 'username', 'picture', 'online', 'block', 'you_block', 'unread_messages', 'messages', 'loaded_messages'],
            groups: ['name', 'description', 'picture', 'unread_messages', 'messages', 'loaded_messages']
        }
        const allowed = allowUpdate[roomType]

        const setKeys = Object.keys(set)
        setKeys.filter(key => allowed.includes(key))

        rooms.map(room => {
            if (whereIsArray ? where.includes(room.id) : where === room.id)
                for (const key of setKeys) room[key] = set[key];

            return room
        })

        return { ...state, [roomType]: rooms }
    },

    'REMOVE_ROOM'(state: User, action: any) {
        const { roomType, roomId } = action
        state[roomType].filter(room => room.id !== roomId)
        return state
    },

    'PUSH_GROUP_USER'(state: User, action: any) {
        const { group_id, users } = action

        const usersIsArray = Array.isArray(users)

        state.groups.map(group => {
            group.id === group_id ? (usersIsArray ? users.forEach(u => group.users.push(u)) : group.users.push(users)) : null
            return group
        })

        return state
    },

    'UPDATE_GROUP_USER'(state: User, action: any) {
        const { group_id, member_id, set } = action

        const allowed = ['role']

        const setKeys = Object.keys(set)
        setKeys.filter(key => allowed.includes(key))

        state.groups.map(group => {
            group.id === group_id ? group.users.map(user => {
                if (user.id === member_id) for (const key of setKeys) user[key] = set[key];
                return user
            }) : null
            state.id === member_id && setKeys.includes('role') ? group.role = set['role'] : null

            return group
        })

        return state
    },

    'REMOVE_GROUP_USER'(state: User, action: any) {
        const { group_id, member_id } = action

        state.groups.map(group => {
            group.id === group_id ? group.users.filter(u => u.id !== member_id) : null
            return group
        })

        return state
    },

    'PUSH_MESSAGE'(state: User, action: any) {
        const { where, data, roomType } = action
        if (!where || !data || !roomType) return state;

        const rooms = state[roomType]
        if (!rooms) return state;

        const whereIsArray = Array.isArray(where)
        let position: number

        rooms.map((room: Contact | Group, i: number) => {
            if (whereIsArray ? where.includes(room.id) : where === room.id) {
                position = i
                room.messages.push(data.message)
                room.unread_messages += 1;
            }

            return room
        })

        return { ...state, [roomType]: roomUtil.orderRooms(rooms, position, 0) }
    },

    'REMOVE_MESSAGE'(state: User, action: any) {
        const { where, messageId, roomType } = action

        const rooms = state[roomType]
        if (!rooms) return state;

        rooms.map(room => {
            if (room.id === where) room.messages.filter(m => m.id !== messageId);
            return room
        })

        return { ...state }
    },

    'PUSH_NEW_USER_DATA'(state: User, action: any) {
        const { data, dataType } = action

        const items: any[] = state[dataType]
        if (!items) return state;

        Array.isArray(data) ? data.forEach(d => !items.find(i => i.id === d.id) ? items.unshift(d) : null)
            : !items.find(i => i.id === data.id) ? items.unshift(data) : null

        state[dataType] = items
        return state
    },

    'REMOVE_USER_DATA'(state: User, action: any) {
        const { dataType, whereId } = action

        const data = state[dataType]
        const filteredData = data.filter(d => d.id !== whereId)
        state[dataType] = filteredData

        return state
    },

    'REMOVE_INVITE'(state: User, action: any) {
        const { inviteId } = action
        state.invitations.filter(i => i.id !== inviteId)
        return state
    },

    'VIEW_NOTIFICATIONS'(state: User, _action: any) {
        state.notifications.map(n => {
            n.viewed = true
            return n
        })

        return state
    },
}
