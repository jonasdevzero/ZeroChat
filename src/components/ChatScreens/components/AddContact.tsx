import { useState } from "react"
import { contactService } from "../../../services"
import { useDebounce, useWarn } from '../../../hooks'
import { useSelector, useDispatch } from 'react-redux'
import * as Actions from '../../../store/actions'
import { AxiosError } from 'axios'
import { Invite } from "../../../types/user"

import {
    Container,
    Content,
    Buttons,
    Invitations,
    InvitationsTitle,
    InvitationsInner,
    Invitation,
    SearchUsers,
    Form,
    Input,
    InputWrapper,
    Users,
    User,
    SearchButton,
    WrapperAvatar,
    Initial,
} from "../../../styles/components/ChatScreens/AddContact"
import {
    Header,
    Title,
    Button,
} from '../../../styles/components/ChatScreens/BaseScreen'
import { Avatar, ButtonBase } from "@material-ui/core"
import {
    Search as SearchIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Check as CheckIcon
} from "@material-ui/icons"

export default function AddContact() {
    const invitations = useSelector(({ user }: any) => user.invitations)
    const [currentOption, setCurrentOption] = useState<'invites' | 'search'>('search')

    const [username, setUsername] = useState("")
    const [users, setUsers] = useState([])

    const warn = useWarn()
    const dispatch = useDispatch()

    useDebounce(() => { contactService.search(username).then(users => setUsers(users)) }, [username], 500)

    function invite(contactId: string) {
        contactService.invite(contactId)
            .then(message => {
                warn.success(message)
                setUsers(users?.filter(u => u.id !== contactId))
            })
            .catch((error: AxiosError) => warn.error(error.response.data.message))
    }

    function acceptInvite(invitationId: string) {
        contactService.acceptInvite(invitationId)
            .then(contact => {
                dispatch(Actions.user.pushData(contact, 'contacts'))
                dispatch(Actions.user.removeData('invitations', invitationId))
                warn.success('User accepted')
            })
            .catch((error: AxiosError) => {
                const { message } = error.response.data
                warn.error(message)
            })
    }

    function refuseInvite(invitationId: string) {
        contactService.refuseInvite(invitationId)
            .then(message => {
                dispatch(Actions.user.removeData('invitations', invitationId))
                warn.success(message)
            })
            .catch(() => { })
    }

    function renderUsers(users: any[]) {
        return !users.length ? null : users.map(u => {
            return (
                <User key={u.id}>
                    <WrapperAvatar>
                        <Avatar src={u.picture} />
                        <h3>{u.username}</h3>
                    </WrapperAvatar>

                    <ButtonBase onClick={() => invite(u.id)}>
                        <AddIcon fontSize="large" />
                    </ButtonBase>
                </User>
            )
        })
    }

    function renderInvites(invites: Invite[]) {
        return !invites.length ? (
            <Initial>
                <span>No invites pending</span>
            </Initial>
        ) : invites.map(i => {
            return (
                <Invitation key={i.id}>
                    <Avatar src={i.sender.picture} />

                    <h3>{i.sender.username}</h3>

                    <div className='buttons'>
                        <ButtonBase onClick={() => refuseInvite(i.id)}>
                            <CloseIcon />
                        </ButtonBase>

                        <ButtonBase onClick={() => acceptInvite(i.id)}>
                            <CheckIcon />
                        </ButtonBase>
                    </div>
                </Invitation>
            )
        })
    }

    return (
        <Container>
            <Header>
                <Title>Add Contact</Title>

                <Buttons>
                    <Button onClick={() => setCurrentOption('search')}>
                        Search
                    </Button>

                    <Button onClick={() => setCurrentOption('invites')}>
                        Invites
                    </Button>

                    <Button onClick={() => dispatch(Actions.screen.removeScreen())}>
                        <CloseIcon />
                    </Button>
                </Buttons>
            </Header>

            <Content>
                {currentOption === 'search' ? (
                    <SearchUsers>
                        <InvitationsTitle>
                            <h2>Search Users</h2>
                        </InvitationsTitle>

                        <Form onSubmit={e => e.preventDefault()}>
                            <InputWrapper>
                                <Input
                                    placeholder="Type an username"
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />

                                <SearchButton>
                                    <SearchIcon />
                                </SearchButton>
                            </InputWrapper>
                        </Form>

                        <Users>{renderUsers(users)}</Users>
                    </SearchUsers>
                ) : currentOption === 'invites' ? (
                    <Invitations>
                        <InvitationsTitle>
                            <h2>Invites</h2>
                        </InvitationsTitle>

                        <InvitationsInner>{renderInvites(invitations)}</InvitationsInner>
                    </Invitations>
                ) : null}
            </Content>
        </Container>
    );
};
