export function setContainer(container: 'profile' | 'messages' | 'addContact' | 'createGroup' | 'groupDashboard') {
    return {
        type: 'SET_CONTAINER',
        container
    }
}
