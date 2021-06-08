import { useSelector, useDispatch } from 'react-redux'
import * as ScreenActions from '../../store/actions/screen'

import {
    Profile,
    AddContact,
    CreateGroup,
    GroupDashboard,
    Settings,
} from './components'
import {
    Container,
    Header,
    Title,
    Close,
    Content
} from '../../styles/components/ChatScreens'
import CloseIcon from '@material-ui/icons/Close'

function ChatScreens() {
    const screen: string = useSelector((state: any) => state.screen.current)
    const dispatch = useDispatch()

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

    return (
        <>
            {screen ? (
                <Container>
                    <Header>
                        <Title>{screen}</Title>
                        <Close onClick={() => dispatch(ScreenActions.removeScreen())}>
                            <CloseIcon fontSize='large' />
                        </Close>
                    </Header>

                    <Content>{getScreen()}</Content>
                </Container>
            ) : null}
        </>
    )
}

export default ChatScreens
