import Head from 'next/head';
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import api from "../services/api";
import { UserI, ContactI, GroupI, GroupUserI } from "../types/user";
import useSetUserMaster from "../hooks/useSetUserMaster";

import {
    Container,
    Inner,
    ContainerWithoutChat,
} from '../styles/pages/chat';
import {
    Sidebar,
    Messages,
    Profile,
    AddContact,
    CreateGroup,
    Loading,
} from "../components"

let socket: SocketIOClient.Socket = undefined;
const ENDPOINT = "ws://localhost:3001";

interface ChatI {
    setToken: React.Dispatch<React.SetStateAction<string>>;
    theme: "light" | "dark";
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
};

export default function Chat({ setToken, theme, setTheme }: ChatI) {
    const [user, setUser] = useState<UserI>();
    const setUserMaster = useSetUserMaster(user, setUser);

    const [currentContainer, setCurrentContainer] = useState<"profile" | "contacts" | "groups" | "addContact" | "createGroup">("contacts");
    const [currentContact, setCurrentContact] = useState<ContactI>();
    const [currentGroup, setCurrentGroup] = useState<GroupI>();

    const messagesContainerRef = useRef(null);

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket = io(ENDPOINT, { transports: ["websocket"] });

        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            router.push("/signin");
        };

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        api.post(`/user/auth?user_required=true`).then(response => {
            const data = response.data;
            setToken(data.token);

            api.get(`/group`).then(response => {
                const { groups } = response.data;

                data.user.groups = groups.map(group => {
                    group.unread_messages = group.users.find((u: GroupUserI) => u?.id === data.user.id).unread_messages;
                    return group;
                });

                const rooms: string[] = [data.user.id];
                groups.forEach(group => rooms.push(group.id));

                api.get(`/contact`).then(response => {
                    const { contacts } = response.data;
                    data.user.contacts = contacts;

                    const contactsId: string[] = [];
                    contacts.forEach(contact => contactsId.push(contact.id));

                    socket.emit("join", { rooms, contacts: contactsId }, (contactsOnline: string[]) => {
                        data.user?.contacts?.map((contact: ContactI) => {
                            contact.online = false;
                            if (contactsOnline.includes(contact.id))
                                contact.online = true;

                            return contact;
                        });
                        setUser(data.user);
                        setLoading(false);
                    });
                });
            });
        }).catch(() => {
            setToken("");
            router.push("/signin");
        });

        return () => {
            socket.disconnect();
            socket.off("private-message");
            socket.off("group-message");
            socket.off("user");
            socket.off("group");
        };
    }, []);

    useEffect(() => {
        socket.removeAllListeners();

        socket.on("private-message", ({ message }) => {
            const sender = message.sender_id, receiver = message.contact.id;

            const existsContact = user?.contacts?.find(c => c?.id === sender);
            if (!existsContact && user?.id === receiver) {
                api.get(`/contact/${sender}`).then(response => {
                    const contact: ContactI = response.data.contact;

                    socket.emit("user", { event: "addContact", contactId: contact.id }, (isOnline: boolean) => {
                        contact.online = isOnline;
                        setUserMaster.contacts.push(contact);
                    });
                });
            } else {
                const currentContactId = currentContact?.id;
                setUserMaster.contacts.pushMessage({ where: [sender, receiver], message, currentContactId }).then(() => {
                    if (currentContact?.id === receiver || currentContact?.id === sender) {
                        scrollToBottom(true);
                    };
                });
            };
        });

        socket.on("group-message", ({ message }) => {
            const group_id = message.group_id, currentGroupId = currentGroup?.id;

            setUserMaster.groups.pushMessage({ where: group_id, message, currentGroupId }).then(() => {
                if (currentGroup?.id === group_id) {
                    scrollToBottom(true);
                };
            });
        });

        socket.on("user", ({ event, where, set }) => {
            switch (event) {
                case "update":
                    setUserMaster.contacts.update({ where, set })
                    break;
            };
        });

        socket.on("group", ({ event, group }) => {
            switch (event) {
                case "new":
                    setUserMaster.groups.push(group);
                    break;
            };
        });
    }, [user, currentContact, currentGroup]);

    useEffect(() => {
        scrollToBottom();

        if (currentContainer === "contacts" && currentContact) {
            if (!(currentContact?.messages)) {
                api.get(`/contact/messages?contact_id=${currentContact?.id}`).then(response => {
                    const { contact_id, messages } = response.data.contact;
                    setUserMaster.contacts.update({ where: contact_id, set: { messages } }).then(() => scrollToBottom());
                });
            };
            if (currentContact?.unread_messages > 0) {
                api.put(`/contact/${currentContact?.id}?unread_messages=true`).then(() => {
                    setUserMaster.contacts.update({ where: currentContact.id, set: { unread_messages: 0 } });
                });
            };
        } else if (currentContainer === "groups" && currentGroup) {
            if (!(currentGroup?.messages)) {
                api.get(`/group/messages?group_id=${currentGroup?.id}`).then(response => {
                    const { messages } = response.data;
                    setUserMaster.groups.update({ where: currentGroup.id, set: { messages } }).then(() => scrollToBottom());
                });
            };
            if (currentGroup?.unread_messages > 0) {
                api.put(`/group/${currentGroup.id}?unread_messages=true`).then(() => {
                    setUserMaster.groups.update({ where: currentGroup.id, set: { unread_messages: 0 } });
                });
            };
        };
    }, [currentContact, currentGroup]);

    function scrollToBottom(newMessage?: boolean) {
        if (messagesContainerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messagesContainerRef.current;
            const scroll = scrollHeight - clientHeight;

            if (newMessage) {
                if (scrollTop + 200 > scrollHeight - clientHeight) {
                    messagesContainerRef.current.scrollTo(0, scroll);
                };
            } else {
                messagesContainerRef.current.scrollTo(0, scroll);
            };
        };
    };

    return (
        <Container>
            <Head>
                <title>Zero | Chat</title>
            </Head>

            {!loading ? (
                <>
                    <Sidebar
                        user={user}
                        setToken={setToken}
                        setCurrentContainer={setCurrentContainer}
                        setCurrentContact={setCurrentContact}
                        setCurrentGroup={setCurrentGroup}
                        theme={theme}
                        setTheme={setTheme}
                    />

                    <Inner>
                        {currentContainer === "profile" ? (
                            <Profile
                                user={user}
                                setUserMaster={setUserMaster}
                                theme={theme}
                                setToken={setToken}
                                socket={socket}
                            />
                        ) :
                            currentContainer === "contacts" || currentContainer === "groups" ? (
                                !currentContact && !currentGroup ? (
                                    <ContainerWithoutChat>
                                        {currentContainer === "contacts" ? (
                                            <h1>Select a contact to chat</h1>
                                        ) : (
                                            <h1>Select a group to chat</h1>
                                        )}
                                    </ContainerWithoutChat>
                                ) : (
                                    <Messages
                                        user={user}
                                        socket={socket}
                                        currentContact={currentContact}
                                        currentGroup={currentGroup}
                                        currentContainer={currentContainer}
                                        messagesContainerRef={messagesContainerRef}
                                        scrollToBottom={scrollToBottom}
                                    />
                                )
                            ) :
                                currentContainer === "addContact" ? (
                                    <AddContact
                                        user={user}
                                        setUserMaster={setUserMaster}
                                        setCurrentContact={setCurrentContact}
                                        setCurrentContainer={setCurrentContainer}
                                        socket={socket}
                                    />
                                ) :
                                    currentContainer === "createGroup" ? (
                                        <CreateGroup
                                            user={user}
                                            setUserMaster={setUserMaster}
                                            setCurrentGroup={setCurrentGroup}
                                            setCurrentContainer={setCurrentContainer}
                                            socket={socket}
                                        />
                                    ) : null
                        }
                    </Inner>
                </>
            ) : (
                <Loading theme={theme} />
            )}
        </Container>
    );
};
