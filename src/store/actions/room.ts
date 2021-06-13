import { Contact, Group } from "../../types/user";

export function setRoom(room: Contact | Group | undefined, roomType: 'contact' | 'group') {
    return {
        type: 'SET_ROOM',
        room,
        roomType
    }
}

export function removeRoom() {
    return {
        type: 'REMOVE_ROOM'
    }
}

export function toggleShowInfo() {
    return {
        type: 'TOGGLE_SHOW_ROOM_INFO'
    }
}

export default {
    setRoom,
    removeRoom,
    toggleShowInfo
}
