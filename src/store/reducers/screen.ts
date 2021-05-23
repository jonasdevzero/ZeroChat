const INITIAL_STATE = {
    current: undefined,
}

export default function screenReducer(state = INITIAL_STATE, action: any) {
    switch(action.type) {
        case 'SET_SCREEN':
            return { ...state, current: action.screen }
        default:
            return state
    }
}
