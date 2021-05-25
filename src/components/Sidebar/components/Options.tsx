import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import * as Actions from '../../../store/actions'
import { useTheme } from '../../../hooks'
import Cookies from 'js-cookie'

import {
    Container,
    User,
    OptionsInner,
    OptionsPlus,
    Option,
} from "../../../styles/components/Sidebar/components/Options"
import { Avatar } from "@material-ui/core"
import {
    PersonRounded as PersonIcon,
    GroupRounded as GroupIcon,
    Brightness3 as Brightness3Icon,
    Brightness7 as Brightness7Icon,
    PowerSettingsNew as PowerSettingsNewIcon,
    CallRounded as CallIcon,
    NotificationsRounded as NotificationsIcon,
} from "@material-ui/icons"

function Options({ setOptionSelected }) {
    const userPicture = useSelector((state: any) => state.user.picture)

    const router = useRouter()
    const [theme, setTheme] = useTheme()
    const dispatch = useDispatch()

    function logOut() {
        Cookies.remove('token')
        router.replace('/')
    }

    return (
        <Container>
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
        </Container>
    )
}

export default Options
