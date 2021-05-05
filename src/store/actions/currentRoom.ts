import { ContactI, GroupI } from "../../types/user";

export function setCurrentRoom(room: ContactI | GroupI | undefined, roomType: 'contact' | 'group') {
    return {
        type: 'SET_CURRENT_ROOM',
        room,
        roomType
    }
}

export function removeCurrentRoom() {
    return {
        type: 'REMOVE_CURRENT_ROOM'
    }
}
