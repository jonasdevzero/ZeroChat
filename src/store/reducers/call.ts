const INITIAL_STATE = {
    startingOrReceiving: undefined,
    userCall: undefined,
    userSignal: undefined,
    type: undefined,
    minimized: false
}

export default function chat(state = INITIAL_STATE, action: any) {
    switch(action.type) {
        case 'CALL_REQUEST':
            return {
                ...state,
                startingOrReceiving: 'receiving',
                type: action.callType,
                userCall: action.userCall,
                userSignal: action.userSignal
            }
        case 'CALL_START':
            return {
                ...state,
                startingOrReceiving: 'starting',
                type: action.callType,
                userCall: action.userCall
            }
        case 'CALL_END':
            return INITIAL_STATE
        case 'TOGGLE_CALL_MINIMIZED':
            return {
                ...state,
                minimized: !state.minimized
            }
        default:
            return state
    }
}
