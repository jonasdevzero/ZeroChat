import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux'
import { socket } from '../../services'
import * as UserActions from '../../store/actions/user'
import * as CallActions from '../../store/actions/call'
import { UserI } from "../../types/user";

import { Header, Rooms, Notifications, Invitations } from './components'
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
    EmailRounded as InvitationsIcon
} from "@material-ui/icons";

interface SidebarI {
    theme: "light" | "dark";
    setTheme: Dispatch<SetStateAction<"light" | "dark">>;
};

export default function Sidebar({ theme, setTheme }: SidebarI) {
    const user: UserI = useSelector((state: any) => state.user)
    const [optionSelected, setOptionSelected] = useState('contacts')

    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        socket.on("new-group", (group) => {
            socket.emit("join-group", group.id)
            dispatch(UserActions.pushRoom({ roomType: 'group', room: group }))
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
                <User>
                    <Avatar src={user.picture} />
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

                    <Option onClick={() => setOptionSelected("invitations")}>
                        <InvitationsIcon />
                    </Option>

                    <Option onClick={() => dispatch(CallActions.toggleCallMinimized())}>
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
                        case 'invitations':
                            return <Invitations />
                    }
                }()}
            </Inner>
        </Container>
    );
};
