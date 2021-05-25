import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Cookies from 'js-cookie'
import { useSelector, useDispatch } from 'react-redux'
import { socket } from '../../services'
import * as Actions from '../../store/actions'
import { useTheme } from '../../hooks'

import { Header, Rooms, Notifications } from './components'
import {
    Container,
    Options,
    User,
    OptionsInner,
    OptionsPlus,
    Option,
    Inner,
} from "../../styles/components/Sidebar";
import { Avatar } from "@material-ui/core";
import {
    PersonRounded as PersonIcon,
    GroupRounded as GroupIcon,
    Brightness3 as Brightness3Icon,
    Brightness7 as Brightness7Icon,
    PowerSettingsNew as PowerSettingsNewIcon,
    CallRounded as CallIcon,
    NotificationsRounded as NotificationsIcon,
} from "@material-ui/icons";

export default function Sidebar() {
    const userPicture = useSelector((state: any) => state.user.picture)
    const [optionSelected, setOptionSelected] = useState('contacts')

    const [theme, setTheme] = useTheme()

    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        socket.on("new-group", (group) => {
            socket.emit("join-group", group.id)
            dispatch(Actions.user.pushRoom({ roomType: 'group', room: group }))
        })
        socket.on('update', action => dispatch(action))
    }, [])

    function logOut() {
        Cookies.remove('token')
        router.replace('/')
    }

    return (
        <Container>
            <Options>
                <User onClick={() => dispatch(Actions.screen.setScreen('profile'))}>
                    <Avatar src={userPicture} />
                </User>

                <OptionsInner>
                    <Option onClick={() => setOptionSelected("contacts")}>
                        <PersonIcon />
                    </Option>

                    <Option onClick={() => setOptionSelected("groups")}>
                        <GroupIcon />
                    </Option>

                    <Option onClick={() => setOptionSelected("notifications")}>
                        <NotificationsIcon />
                    </Option>

                    <Option onClick={() => dispatch(Actions.call.toggleCallMinimized())}>
                        <CallIcon />
                    </Option>
                </OptionsInner>

                <OptionsPlus>
                    <Option onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} >
                        {theme === "dark" ? (<Brightness3Icon />) : (<Brightness7Icon />)}
                    </Option>

                    <Option onClick={() => logOut()} >
                        <PowerSettingsNewIcon />
                    </Option>
                </OptionsPlus>
            </Options>

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
