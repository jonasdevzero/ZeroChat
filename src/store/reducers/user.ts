import store from '../'
import { api } from "../../services"
import { ContactI, GroupI, UserI } from "../../types/user"

const INITIAL_STATE = {
    name: '',
    username: '',
    picture: '',
    email: '',
    contacts: [],
    groups: [],
    notifications: [],
    invitations: []
} as unknown as UserI

export default function user(state = INITIAL_STATE, action: any) {
    action.roomType ? action.roomType = `${action.roomType}s` : null

    const reducer = reducers[action.type]
    if (!reducer) return state;

    return reducer(state, action)
}

function orderRoomsByLastMessage<T extends any[]>(arr: T, from: number, to: number) {
    arr?.splice(to, 0, arr?.splice(from, 1)[0]);
    return arr;
}

const reducers = {
    'SET_USER'(_state: UserI, action: any) {
        return action.user
    },

    'UPDATE_USER'(state: UserI, action: any) {
        const { set } = action

        const setKeys = Object.keys(set)
        const allowUpdate = ['name', 'username', 'email', 'picture']
        setKeys.filter(key => allowUpdate.includes(key))

        const data: { [key: string]: any } = {}
        for (const key of setKeys) data[key] = set[key]

        return { ...state, ...data }
    },

    'UPDATE_ROOM'(state: UserI, action: any) {
        const { where, set, roomType } = action
        if (!where || !set || !roomType) return state;

        const rooms = state[roomType]
        if (!rooms) return state;

        const whereIsArray = Array.isArray(where)
        const allowUpdate = {
            contacts: ['name', 'username', 'picture', 'online', 'block', 'you_block', 'unread_messages', 'messages'],
            groups: ['name', 'description', 'picture', 'unread_messages', 'messages']
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

    'PUSH_MESSAGE'(state: UserI, action: any) {
        const { where, data, roomType, currentRoom } = action
        if (!where || !data || !roomType || !currentRoom) return state;

        const rooms = state[roomType]
        if (!rooms) return state;

        const whereIsArray = Array.isArray(where)
        let position: number

        rooms.map((room: ContactI | GroupI, i: number) => {
            if (whereIsArray ? where.includes(room.id) : where === room.id) {
                position = i
                room.messages.push(data.message)

                currentRoom === data.to ?
                    api.put(`/${roomType}/${currentRoom}?action=unread_messages`).then(() => room.unread_messages = undefined)
                    : room.unread_messages ? room.unread_messages++ : room.unread_messages = 1;
            }

            return room
        })

        return { ...state, [roomType]: orderRoomsByLastMessage(rooms, position, 0) }
    },

    'REMOVE_MESSAGE'(state: UserI, action: any) {
        return { ...state }
    },

    'PUSH_ROOM'(state: UserI, action: any) {
        const { roomType, room } = action
        state[roomType].unshift(room)
        return state
    },

    'REMOVE_ROOM'(state: UserI, action: any) {
        const { roomType, roomId } = action
        state[roomType].filter(room => room.id !== roomId)
        return state
    },
}
