import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { UserI, ContactI, GroupI } from "../types/user";
import { SetUserMasterI } from "../types/useSetUserMaster";
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
    setUserMaster: SetUserMasterI;
    setCurrentContainer: Dispatch<SetStateAction<"profile" | "messages" | "addContact" | "createGroup">>;
    setCurrentRoom: Dispatch<SetStateAction<ContactI & GroupI>>;
    setCurrentRoomType: Dispatch<SetStateAction<"contact" | "group">>;
    socket: SocketIOClient.Socket;
};

export default function AddContact({ user, setUserMaster, setCurrentContainer, setCurrentRoom, setCurrentRoomType, socket }: AddContactI) {
    const [username, setUsername] = useState("");
    const [contacts, setContacts] = useState<UserI[]>();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    };

    async function add(contact: UserI) {
        await api.post(`/contact`, { contact_id: contact.id }).then(response => {
            const newContact = response.data.contact;
            newContact.messages = [];

            socket.emit("user", { contactId: newContact.id, event: "addContact" }, (isOnline: boolean) => {
                newContact.online = isOnline;

                setUserMaster.contacts.push(newContact).then(() => {
                    setCurrentRoomType("contact");
                    setCurrentRoom(newContact);
                    setCurrentContainer("messages");
                });
            });
        });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
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
