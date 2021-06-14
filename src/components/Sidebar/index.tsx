import { useState, useEffect } from "react"
import { useDispatch } from 'react-redux'
import { socket, contactService, notificationsService } from '../../services'
import * as UserActions from '../../store/actions/user'

import { Options, Header, Rooms, Notifications } from './components'
import { Container, Inner } from "../../styles/components/Sidebar"

export default function Sidebar() {
    const [optionSelected, setOptionSelected] = useState('contacts')
    const dispatch = useDispatch()

    useEffect(() => {
        socket.on('update', action => {
            dispatch(action)
            notificationsService.get()
                .then(notifications => dispatch(UserActions.pushData(notifications, 'notifications')))
                .then(() => console.log('Getting more notifications'))
        })

        socket.on('new-group', group => socket.emit("join-group", group.id, () => pushData(group, 'groups')))

        socket.on('invite-accepted', contactId => {
            socket.emit('new-contact', contactId, (_error, online: boolean) => {
                contactService.show(contactId).then(contact => {
                    contact.online = online
                    pushData(contact, 'contacts')
                })
            })
        })
    }, [])

    const pushData = (data, dataType) => dispatch(UserActions.pushData(data, dataType))

    return (
        <Container>
            <Options setOptionSelected={setOptionSelected} />

            <Inner>
                <Header optionSelected={optionSelected} />
                {optionSelected === 'notifications' ? (<Notifications />) : (<Rooms roomsType={optionSelected} />)}
            </Inner>
        </Container>
    )
}
