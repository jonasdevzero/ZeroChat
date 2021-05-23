import { ContactI, GroupI, UserI } from "../../types/user"

interface UpdateUserI {
    name?: string
    username?: string
    picture?: string
    email?: string
}

interface UpdateRoomI {
    where: string | string[]
    set: {
        name?: string
        username?: string
        picture?: string
        messages?: []
        unread_messages?: number
        description?: string
        block?: boolean
        you_block?: boolean
        online?: boolean
    }
    roomType: 'contacts' | 'groups'
}

interface RoomI {
    roomType: 'contact' | 'group',
    room: ContactI | GroupI
}

export function setUser(user: UserI) {
    return {
        type: 'SET_USER',
        user
    }
}

export function updateUser(set: UpdateUserI) {
    return {
        type: 'UPDATE_USER',
        set
    }
}

export function updateRoom(data: UpdateRoomI) {
    return {
        type: 'UPDATE_ROOM',
        ...data
    }
}

export function pushRoom(data: RoomI) {
    return {
        type: 'PUSH_ROOM',
        ...data
    }
}

export function removeRoom(data: RoomI) {
    return {
        type: 'REMOVE_ROOM',
        ...data
    }
}

export default {
    setUser,
    updateUser,
    updateRoom,
    pushRoom,
    removeRoom,
}
