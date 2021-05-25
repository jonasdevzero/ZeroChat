import { useState, useEffect } from "react"
import { useDispatch } from 'react-redux'
import { socket } from '../../services'
import * as UserActions from '../../store/actions/user'

import { Options, Header, Rooms, Notifications } from './components'
import { Container, Inner } from "../../styles/components/Sidebar"

export default function Sidebar() {
    const [optionSelected, setOptionSelected] = useState('contacts')
    const dispatch = useDispatch()

    useEffect(() => {
        socket.on("new-group", (group) => {
            socket.emit("join-group", group.id)
            dispatch(UserActions.pushRoom({ roomType: 'group', room: group }))
        })
        socket.on('update', action => dispatch(action))
    }, [])

    return (
        <Container>
            <Options setOptionSelected={setOptionSelected} />

            <Inner>
                <Header optionSelected={optionSelected} />

                {function() {
                    switch(optionSelected) {
                        case 'contacts' || 'groups':
                            return <Rooms roomsType={optionSelected} />
                        case 'notifications':
                            return <Notifications />
                    }
                }()}
            </Inner>
        </Container>
    );
};
