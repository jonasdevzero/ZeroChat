import { Notification } from '../../types/user'

export default interface NotificationsService {
    get(): Promise<Notification[]>

    clear(): Promise<'ok'>
}
