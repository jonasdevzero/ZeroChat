import { useSelector } from 'react-redux'
import { NotificationI } from '../../../types/user'

function Notifications() {
    const notifications: NotificationI[] = useSelector((state: any) => state.user.notifications)

    return (
        <div>
            {notifications.map(n => {
                return (
                    <div key={n.id}>
                        <p>{n.text}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Notifications
