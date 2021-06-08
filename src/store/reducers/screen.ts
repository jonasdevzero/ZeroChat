const INITIAL_STATE = {
    current: undefined,
    data: undefined,
}

export default function screenReducer(state = INITIAL_STATE, action: any) {
    switch(action.type) {
        case 'SET_SCREEN':
            return { ...state, current: action.screen }
        case 'REMOVE_SCREEN':
            return INITIAL_STATE
        default:
            return state
    }
}
