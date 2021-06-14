import { useSelector } from 'react-redux'
import {
    Container,
    Title,
    Pending
} from '../../../styles/components/Sidebar/Header'

function Header({ optionSelected }: { optionSelected: string }) {
    const pending = useSelector(({ user }: any) => ({
        contacts: user.contacts.reduce((acc, crr) => crr.unread_messages > 0 ? acc += 1 : acc, 0) + user.invitations.length,
        groups: user.groups.reduce((acc, crr) => crr.unread_messages > 0 ? acc += 1 : acc, 0),
        notifications: user.notifications.length,
    }))

    return (
        <Container>
            <Title>{optionSelected}</Title>
            {pending[optionSelected] ? (<Pending>{pending[optionSelected]}</Pending>) : null}
        </Container>
    )
}

export default Header
