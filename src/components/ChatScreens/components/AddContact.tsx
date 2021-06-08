import { useState } from "react"
import { contactService } from "../../../services"
import { useDebounce, useWarn } from '../../../hooks'
import { useSelector, useDispatch } from 'react-redux'
import * as UserActions from '../../../store/actions/user'
import { AxiosError } from 'axios'

import {
    Container,
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
import { Avatar, ButtonBase } from "@material-ui/core"
import {
    Search as SearchIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Check as CheckIcon
} from "@material-ui/icons"

export default function AddContact() {
    const { userId, userContacts, invitations } = useSelector(({ user }: any) => {
        return {
            userId: user.id,
            userContacts: user.contacts,
            invitations: user.invitations
        }
    })

    const [username, setUsername] = useState("")
    const [users, setUsers] = useState<{ id: string, username: string, picture: string }[]>(undefined)

    const warn = useWarn()
    const dispatch = useDispatch()

    function invite(contactId: string) {
        contactService.invite(contactId)
            .then(message => warn.success(message))
            .catch((error: AxiosError) => warn.error(error.response.data.message))
    }

    function acceptInvite(invitationId: string) {
        contactService.acceptInvite(invitationId)
            .then(contact => {
                dispatch(UserActions.pushRoom({ roomType: "contact", room: contact }))
                warn.success('User accepted')
            })
            .catch((error: AxiosError) => {
                const { message } = error.response.data
                warn.error(message)
            })
    }

    function refuseInvite(invitationId: string) {
        contactService.refuseInvite(invitationId)
            .then(message => warn.success(message))
            .catch(() => {})
    }

    useDebounce(() => {
        contactService.search(username)
            .then(users => setUsers(users?.filter(u => u.id !== userId && !(userContacts.find(c => c.id === u.id)))))
    }, [username], 500)

    return (
        <Container>
            <Invitations>
                <InvitationsTitle>
                    <h2>Invitations</h2>
                </InvitationsTitle>

                <InvitationsInner>
                    {invitations.map(i => {
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
                    })}
                </InvitationsInner>
            </Invitations>

            <SearchUsers>
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

                <Users>
                    {users ? users.map((contact, i) => {
                        return (
                            <User onClick={() => invite(contact.id)} key={i}>
                                <WrapperAvatar>
                                    <Avatar src={contact.picture} />
                                    <h3>{contact.username}</h3>
                                </WrapperAvatar>

                                <AddIcon fontSize="large" />
                            </User>
                        );
                    }) : (
                        <Initial>
                            <strong>Search for users</strong>
                        </Initial>
                    )}
                </Users>
            </SearchUsers>
        </Container>
    );
};
