import { Contact, Group } from "../../types/user"

const INITIAL_STATE = {
    type: undefined,
    current: undefined,
    showInfo: false
} as {
    type: 'contact' | 'group',
    current: Contact & Group,
    showInfo: boolean,
}

export default function roomReducer(state = INITIAL_STATE, action: any) {
    switch (action.type) {
        case 'SET_ROOM':
            return { ...state, type: action.roomType, current: action.room }
        case 'TOGGLE_SHOW_ROOM_INFO':
            return { ...state, showInfo: !state.showInfo }
        case 'REMOVE_ROOM':
            return INITIAL_STATE
        default:
            return state
    }
}
