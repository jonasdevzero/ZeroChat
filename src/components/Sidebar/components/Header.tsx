import { useSelector } from 'react-redux'
import {
    Container,
    Title,
    UnreadMessages
} from '../../../styles/components/Sidebar/components/Header'

function Header({ optionSelected }: { optionSelected: string }) {
    const unreadMessages = useSelector(({ user }: any) => ({
        contacts: user.contacts.reduce((acc, crr) => acc += crr.unread_messages, 0),
        groups: user.groups.reduce((acc, crr) => acc += crr.unread_messages, 0)
    }))

    return (
        <Container>
            <Title>{optionSelected}</Title>

            {['contacts', 'groups'].includes(optionSelected) ? (
                <UnreadMessages>
                    {unreadMessages[optionSelected]}
                </UnreadMessages>
            ) : null}
        </Container>
    )
}

export default Header
