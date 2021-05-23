export function callRequest({ signal, callType, userCall }) {
    return {
        type: 'CALL_REQUEST',
        userSignal: signal,
        callType,
        userCall
    }
}

export function callStart(userCall, callType) {
    return {
        type: 'CALL_START',
        userCall,
        callType
    }
}

export function callEnd() {
    return  {
        type: 'CALL_END'
    }
}

export function toggleCallMinimized() {
    return {
        type: 'TOGGLE_CALL_MINIMIZED'
    }
}

export default {
    callRequest,
    callStart,
    callEnd,
    toggleCallMinimized
}
