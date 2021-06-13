import { useSelector } from 'react-redux'

import {
    Profile,
    AddContact,
    CreateGroup,
    GroupDashboard,
    Settings,
} from './components'
import { Container } from '../../styles/components/ChatScreens'

function ChatScreens() {
    const screen: string = useSelector((state: any) => state.screen.current)

    function getScreen() {
        switch (screen) {
            case 'Profile':
                return <Profile />
            case 'Add Contact':
                return <AddContact />
            case 'Create Group':
                return <CreateGroup />
            case 'Group Dashboard':
                return <GroupDashboard />
            case 'Settings':
                return <Settings />
            default:
                return null
        }
    }

    return screen ? (<Container>{getScreen()}</Container>) : null
}

export default ChatScreens
