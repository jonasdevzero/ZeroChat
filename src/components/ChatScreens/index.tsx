import { useSelector, useDispatch } from 'react-redux'
import * as ScreenActions from '../../store/actions/screen'

import {
    Profile,
    AddContact,
    CreateGroup,
    GroupDashboard
} from './components'
import { Container, CloseButton } from '../../styles/components/ChatScreens'
import CloseIcon from '@material-ui/icons/Close'


function ChatScreens({ theme }) {
    const screen = useSelector((state: any) => state.screen.current)
    const dispatch = useDispatch()

    return (
        <>
            {screen ? (
                <Container>
                    <CloseButton onClick={() => dispatch(ScreenActions.setScreen(undefined))}>
                        <CloseIcon fontSize='large' />
                    </CloseButton>

                    {function () {
                        switch (screen) {
                            case 'profile':
                                return <Profile theme={theme} />
                            case 'addContact':
                                return <AddContact />
                            case 'createGroup':
                                return <CreateGroup theme={theme} />
                            case 'groupDashboard':
                                return <GroupDashboard />
                            default:
                                return null
                        }
                    }()}
                </Container>
            ) : null}
        </>
    )
}

export default ChatScreens
