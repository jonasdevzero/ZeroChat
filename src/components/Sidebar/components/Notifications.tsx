import { useSelector } from 'react-redux'
import { Notification } from '../../../types/user'

import {
    Container,
    Item,
    Text
} from '../../../styles/components/Sidebar/Notifications'
import { Avatar } from '@material-ui/core'

function Notifications() {
    const notifications: Notification[] = useSelector((state: any) => state.user.notifications)

    return (
        <Container>
            {notifications.map(n => {
                return (
                    <Item key={n.id}>
                        <Avatar src={n.image} />
                        <Text>{n.text}</Text>
                    </Item>
                )
            })}
        </Container>
    )
}

export default Notifications
