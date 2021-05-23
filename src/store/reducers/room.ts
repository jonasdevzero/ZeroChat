import { ContactI, GroupI } from "../../types/user"

const INITIAL_STATE = {
    type: undefined,
    current: undefined
} as {
    type: 'contact' | 'group',
    current: ContactI & GroupI
}

export default function roomReducer(state = INITIAL_STATE, action: any) {
    switch (action.type) {
        case 'SET_ROOM':
            return { ...state, type: action.roomType, current: action.room }
        case 'REMOVE_ROOM':
            return INITIAL_STATE
        default:
            return state
    }
}
