import { useState } from "react";
import { UserI } from "../types/user";

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
    NotFound,
    Initial,
} from "../styles/components/AddContact";
import { Avatar } from "@material-ui/core";
import {
    Search as SearchIcon,
    Add as AddIcon,
} from "@material-ui/icons";

export default function AddContact() {
    const [username, setUsername] = useState("");

    const [contacts, setContact] = useState<UserI[]>();
    const [notFound, setNotFound] = useState(false);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        //...
    };

    function add(contact: UserI) {
        //...
    };

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
                            <Contact onClick={() => add(contact)}>
                                <WrapperAvatar>
                                    <Avatar src={contact.picture} />
                                    <p>{contact.username}</p>
                                </WrapperAvatar>

                                <AddIcon fontSize="large" />
                            </Contact>
                        );
                    }) : notFound ? (
                        <NotFound>
                            <strong>No users found!</strong>
                        </NotFound>
                    ) : (
                        <Initial>
                            <strong>Search for users to add to your contacts</strong>
                        </Initial>
                    )}
                </Contacts>
            </Inner>
        </Container>
    );
};
