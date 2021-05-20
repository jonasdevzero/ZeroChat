const INITIAL_STATE: 'profile' | 'addContact' | 'createGroup' | 'groupDashboard' | '' = ''

export default function currentContainer(state = INITIAL_STATE, action: any) {
    switch(action.type) {
        case 'SET_CONTAINER':
            return action.container
        default:
            return state
    }
}
