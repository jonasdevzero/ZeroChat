import { ContactI, GroupI } from "../../types/user"

const INITIAL_STATE = {
    type: undefined,
    room: undefined
} as {
    type: 'contact' | 'group',
    room: ContactI & GroupI
}

export default function currentRoom(state = INITIAL_STATE, action: any) {
    switch (action.type) {
        case 'SET_CURRENT_ROOM':
            return { ...state, type: action.roomType, room: action.room }
        case 'REMOVE_CURRENT_ROOM':
            return INITIAL_STATE
        default:
            return state
    }
}
