import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { notificationsService } from '../../../services'
import { Notification } from '../../../types/user'
import * as UserActions from '../../../store/actions/user'

import {
    Container,
    Item,
    Text
} from '../../../styles/components/Sidebar/Notifications'
import { Avatar } from '@material-ui/core'

function Notifications() {
    const notifications: Notification[] = useSelector((state: any) => state.user.notifications)
    const dispatch = useDispatch()

    useEffect(() => {
        notifications.find(n => !n.viewed) ?
            notificationsService.clear().then(() => dispatch(UserActions.viewNotifications())) : null
    }, [notifications])

    return (
        <Container>
            {notifications.map(n => {
                return (
                    <Item key={n.id} viewed={n.viewed}>
                        <Avatar src={n.image} />
                        <Text>{n.text}</Text>
                    </Item>
                )
            })}
        </Container>
    )
}

export default Notifications
