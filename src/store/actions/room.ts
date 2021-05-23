import { ContactI, GroupI } from "../../types/user";

export function setRoom(room: ContactI | GroupI | undefined, roomType: 'contact' | 'group') {
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

export default {
    setRoom,
    removeRoom
}
