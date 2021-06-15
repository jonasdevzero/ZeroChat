import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import * as Actions from '../../../store/actions'
import Cookies from 'js-cookie'
import { User } from '../../../types/user'

import {
    Container,
    User as UserPicture,
    OptionsInner,
    OptionsPlus,
    Option,
    Pending
} from "../../../styles/components/Sidebar/Options"
import { Avatar } from "@material-ui/core"
import {
    PersonRounded as PersonIcon,
    GroupRounded as GroupIcon,
    PowerSettingsNew as PowerSettingsNewIcon,
    CallRounded as CallIcon,
    NotificationsRounded as NotificationsIcon,
    Settings as SettingsIcon
} from "@material-ui/icons"

function Options({ setOptionSelected }) {
    const userPicture = useSelector((state: any) => state.user.picture)
    const pending = useSelector(({ user }: { user: User }) => ({
        contacts: !!user.contacts.find(c => c.unread_messages > 0) || !!user.invitations.length,
        groups: !!user.groups.find(g => g.unread_messages > 0),
        notifications: !!user.notifications.find(n => !n.viewed),
    }))

    const router = useRouter()
    const dispatch = useDispatch()

    function logOut() {
        Cookies.remove('token')
        router.replace('/')
    }

    return (
        <Container>
            <UserPicture onClick={() => dispatch(Actions.screen.setScreen('Profile'))}>
                <Avatar src={userPicture} />
            </UserPicture>

            <OptionsInner>
                <Option onClick={() => setOptionSelected("contacts")}>
                    {pending.contacts && (<Pending />)}
                    <PersonIcon />
                </Option>

                <Option onClick={() => setOptionSelected("groups")}>
                    {pending.groups && (<Pending />)}
                    <GroupIcon />
                </Option>

                <Option onClick={() => setOptionSelected("notifications")}>
                    {pending.notifications && (<Pending />)}
                    <NotificationsIcon />
                </Option>

                <Option onClick={() => dispatch(Actions.call.toggleCallMinimized())}>
                    <CallIcon />
                </Option>
            </OptionsInner>

            <OptionsPlus>
                <Option onClick={() => dispatch(Actions.screen.setScreen('Settings'))}>
                    <SettingsIcon />
                </Option>

                <Option onClick={() => logOut()} >
                    <PowerSettingsNewIcon />
                </Option>
            </OptionsPlus>
        </Container>
    )
}

export default Options
