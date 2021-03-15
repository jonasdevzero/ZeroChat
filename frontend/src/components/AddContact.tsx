import { useState, useEffect, Dispatch } from "react";
import { UserI, ContactI } from "../types/user";
import api from "../services/api";

import {
    Container,
    Header,
    Inner,
} from "../styles/components/Container";
import {
    Form,
    Input,
    Contacts,
    Contact,
    Submit,
    WrapperAvatar,
    Initial,
} from "../styles/components/AddContact";
import { Avatar } from "@material-ui/core";
import {
    Search as SearchIcon,
    Add as AddIcon,
} from "@material-ui/icons";

interface AddContactI {
    user: UserI;
    setUser: Dispatch<React.SetStateAction<UserI>>;
    setCurrentContact: Dispatch<React.SetStateAction<ContactI>>
    setCurrentContainer: Dispatch<React.SetStateAction<"profile" | "contacts" | "groups" | "addContact" | "createGroup">>
    socket: any;
};

export default function AddContact({ user, setUser, setCurrentContact, setCurrentContainer, socket }: AddContactI) {
    const [username, setUsername] = useState("");

    const [contacts, setContacts] = useState<UserI[]>();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    };

    async function add(contact: UserI) {
        const token = JSON.parse(localStorage.getItem("token"))

        await api.post(`/contact?access_token=${token}`, {
            id: user.id,
            contact_id: contact.id
        }).then(response => {
            const newContact: ContactI = response.data.contact;
            newContact.messages = [];

            socket?.emit("is-online", newContact.id, (online: boolean) => {
                newContact.online = online;

                const updatedContacts: ContactI[] = [newContact];
                user.contacts.forEach(contact => updatedContacts.push(contact))

                setUser({
                    ...user,
                    contacts: updatedContacts
                });

                setCurrentContact(newContact);
                setCurrentContainer("contacts");
            });
        });
    };

    useEffect(() => {
        let timeout = setTimeout(() => {
            if (username.length > 0) {
                api.get(`/user?username=${username}`).then(response => {
                    const users = response.data.users;
                    setContacts(users.filter((u: UserI) => u.id !== user.id && !(user.contacts.find(c => c.id === u.id))));
                });
            } else {
                setContacts(undefined)
            };
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [username]);

    return (
        <Container>
            <Header>
                <h1>Add Contact</h1>
            </Header>

            <Inner>
                <Form onSubmit={onSubmit}>
                    <Input
                        placeholder="Type an username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />

                    <Submit type="submit">
                        <SearchIcon />
                    </Submit>
                </Form>

                <Contacts>
                    {contacts ? contacts.map((contact, i) => {
                        return (
                            <Contact onClick={() => add(contact)} key={i}>
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
