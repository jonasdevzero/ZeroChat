export function setScreen(screen: 'profile' | 'addContact' | 'createGroup' | 'groupDashboard') {
    return {
        type: 'SET_SCREEN',
        screen
    }
}

export function removeScreen() {
    return {
        type: 'SET_SCREEN',
        screen: undefined
    }
}

export default {
    setScreen,
    removeScreen
}
