import { socket, contactService, groupService, notificationsService } from '..'
import store from '../../store'
import { pushData, removeData, pushMessage, UserActionsReturnType } from '../../store/actions/user'
import { Contact, Group, Notification } from '../../types/user'

type Callback = (err?: any, data?: any) => void
type EmitUpdateAction = ReturnType<UserActionsReturnType>
type InviteUserAction = ReturnType<typeof pushData>
type NewMessageAction = ReturnType<typeof pushMessage>

const dispatch = store.dispatch

const pushNotifications = (n: Notification[]) => dispatch(pushData(n, 'notifications'))
const contactOnline = (c: Contact, callback: Callback) => (_error, isOnline: boolean) => { c.online = isOnline; callback() }

const emitEvents =  {
    update: (action: EmitUpdateAction, callback: Callback) => socket.emit('update', action, callback),

    // contact events
    inviteUser: (action: InviteUserAction, callback: Callback) => socket.emit('contact:invite', action, callback),
    inviteAccepted: (c: Contact, callback: Callback) => socket.emit('contact:invite_accepted', c.id, contactOnline(c, callback)),
    addContact: (c: Contact) => socket.emit('contact:new', c.id, contactOnline(c, () => { dispatch(pushData(c, 'contacts')) })),

    // group events
    newGroup: (data: { group: Group, members: string[] }, callback: Callback) => socket.emit('group:new', data, callback),
    joinGroup: (g: Group) => socket.emit('group:join', g.id, () => dispatch(pushData(g, 'groups'))),
    leaveGroup: (groupId: string) => socket.emit('group:leave', groupId, () => dispatch(removeData('groups', groupId))),

    newMessage: (action: NewMessageAction, callback: Callback) => socket.emit('message', action, callback)
}

export function socketEvents() {
    socket.on('update', action => dispatch(action))
    socket.on('message', action => dispatch(action))

    socket.on('notification', () => notificationsService.get().then(pushNotifications))

    socket.on('contact:invite_accepted', contactId => contactService.show(contactId).then(emitEvents.addContact))

    socket.on('group:new', group => emitEvents.joinGroup(group))
    socket.on('group:added', groupId => groupService.show(groupId).then(emitEvents.joinGroup))
    socket.on('group:removed', groupId => emitEvents.leaveGroup(groupId))
}

export default emitEvents
