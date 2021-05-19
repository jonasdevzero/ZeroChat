import { useState } from "react"
import { contactService } from "../../../services"
import { useDebounce } from '../../../hooks'
import { useSelector } from 'react-redux'

import {
    Container,
    Header,
    Inner,
} from "../../../styles/components/ChatScreens/BaseScreen"
import {
    Form,
    Input,
    Contacts,
    Contact,
    Submit,
    WrapperAvatar,
    Initial,
} from "../../../styles/components/ChatScreens/AddContact"
import { Avatar } from "@material-ui/core"
import {
    Search as SearchIcon,
    Add as AddIcon,
} from "@material-ui/icons"

export default function AddContact() {
    const { userId, userContacts } = useSelector(({ user }: any) => ({ userId: user.id, userContacts: user.contacts }))
    const [username, setUsername] = useState("")
    const [contacts, setContacts] = useState<{ id: string, username: string, picture: string }[]>(undefined)

    function invite(contactId: string) {
        contactService.invite(contactId)
    }

    useDebounce(() => {
        contactService.search(username)
            .then(users => setContacts(users.filter(u => u.id !== userId && !(userContacts.find(c => c.id === u.id)))))
    }, [username], 500)

    return (
        <Container>
            <Header>
                <h1>Add Contact</h1>
            </Header>

            <Inner>
                <Form onSubmit={e => e.preventDefault()}>
                    <Input
                        placeholder="Type an username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />

                    <Submit type="button">
                        <SearchIcon />
                    </Submit>
                </Form>

                <Contacts>
                    {contacts ? contacts.map((contact, i) => {
                        return (
                            <Contact onClick={() => invite(contact.id)} key={i}>
                                <WrapperAvatar>
                                    <Avatar src={contact.picture} />
                                    <p>{contact.username}</p>
                                </WrapperAvatar>

                                <AddIcon fontSize="large" />
                            </Contact>
                        );
                    }) : (
                        <Initial>
                            <strong>Search for users to add to your contacts</strong>
                        </Initial>
                    )}
                </Contacts>
            </Inner>
        </Container>
    );
};
