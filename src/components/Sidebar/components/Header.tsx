import { useSelector } from 'react-redux'
import {
    Container,
    Title,
    Pending
} from '../../../styles/components/Sidebar/Header'
import { User } from '../../../types/user'

function Header({ optionSelected }: { optionSelected: string }) {
    const pending = useSelector(({ user }: { user: User }) => ({
        contacts: user.contacts.reduce((acc, crr) => crr.unread_messages > 0 ? acc += 1 : acc, 0) + user.invitations.length,
        groups: user.groups.reduce((acc, crr) => crr.unread_messages > 0 ? acc += 1 : acc, 0),
        notifications: user.notifications.reduce((acc, crr) => !crr.viewed ? acc += 1 : acc, 0),
    }))

    return (
        <Container>
            <Title>{optionSelected}</Title>
            {pending[optionSelected] ? (<Pending>{pending[optionSelected]}</Pending>) : null}
        </Container>
    )
}

export default Header
