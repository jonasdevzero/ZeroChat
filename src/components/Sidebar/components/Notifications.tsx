import { useSelector } from 'react-redux'
import { NotificationI } from '../../../types/user'

import {
    Container,
    Notification,
    Text
} from '../../../styles/components/Sidebar/Notifications'
import { Avatar } from '@material-ui/core'

function Notifications() {
    const notifications: NotificationI[] = useSelector((state: any) => state.user.notifications)

    return (
        <Container>
            {notifications.map(n => {
                return (
                    <Notification key={n.id}>
                        <Avatar src={n.image} />
                        <Text>{n.text}</Text>
                    </Notification>
                )
            })}
        </Container>
    )
}

export default Notifications
