type Screen = 'Profile' | 'Settings' | 'Add Contact' | 'Create Group' | 'Group Dashboard'

export function setScreen(screen: Screen) {
    return {
        type: 'SET_SCREEN',
        screen,
    }
}

export function removeScreen() {
    return {
        type: 'REMOVE_SCREEN',
        screen: undefined
    }
}

export default {
    setScreen,
    removeScreen
}
