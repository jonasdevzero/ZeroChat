import { User } from "../../types/user"
import { UpdateUser, UpdateRoom, RemoveRoom, PushMessage, RemoveMessage, PushData, PushDataType } from '../../types/actions/user'

export function setUser(user: User) {
    return {
        type: 'SET_USER',
        user
    }
}

export function updateUser(set: UpdateUser) {
    return {
        type: 'UPDATE_USER',
        set
    }
}

export function updateRoom(data: UpdateRoom) {
    return {
        type: 'UPDATE_ROOM',
        ...data
    }
}

export function removeRoom(data: RemoveRoom) {
    return {
        type: 'REMOVE_ROOM',
        ...data
    }
}

export function pushMessage(data: PushMessage) {
    return {
        type: 'PUSH_MESSAGE',
        ...data
    }
}

export function removeMessage(data: RemoveMessage) {
    return {
        type: 'REMOVE_MESSAGE',
        ...data
    }
}

export function pushData(data: PushData, dataType: PushDataType) {
    return {
        type: 'PUSH_NEW_USER_DATA',
        data,
        dataType
    }
}

export function removeData(dataType: PushDataType, whereId: string) {
    return {
        type: 'REMOVE_USER_DATA',
        dataType,
        whereId
    }
}

export default {
    setUser,
    updateUser,
    updateRoom,
    removeRoom,
    pushMessage,
    removeMessage,
    pushData,
    removeData
}
