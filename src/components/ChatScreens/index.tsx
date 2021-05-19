import { useSelector } from 'react-redux'

import {
    Profile,
    AddContact,
    CreateGroup,
    GroupDashboard
} from './components'

function ChatScreens({ theme }) {
    const currentContainer = useSelector((state: any) => state.currentContainer)

    return (
        <>
            {function() {
                switch(currentContainer) {
                    case 'profile':
                        return <Profile theme={theme} />
                    case 'addContact':
                        return <AddContact />
                    case 'createGroup':
                        return <CreateGroup theme={theme} />
                    case 'GroupDashboard':
                        return <GroupDashboard />
                    default:
                        return null
                }
            }()}
        </>
    )
}

export default ChatScreens
