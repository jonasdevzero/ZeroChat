import { useSelector } from 'react-redux'
import {
    Container,
    Title,
    Pending
} from '../../../styles/components/Sidebar/Header'

function Header({ optionSelected }: { optionSelected: string }) {
    const pending = useSelector(({ user }: any) => ({
        contacts: user.contacts.reduce((acc, crr) => acc += crr.unread_messages, 0),
        groups: user.groups.reduce((acc, crr) => acc += crr.unread_messages, 0),
        notifications: user.notifications.length,
        invitations: user.invitations.length
    }))

    return (
        <Container>
            <Title>{optionSelected}</Title>

            {pending[optionSelected] ? (<Pending>{pending[optionSelected]}</Pending>) : null}
        </Container>
    )
}

export default Header
