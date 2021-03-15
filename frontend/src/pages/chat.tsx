import Head from 'next/head';
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import api from "../services/api";
import { UserI, ContactI, GroupI } from "../types/user";

import {
    Container,
    Inner,
    Header,
    Room,
    ContainerWithoutChat,
    MessagesContainer,
    Message,
    MessageSender,
    FormContainer,
    Form,
    Input,
    Submit,
    IconButton,
    ScrollToBottom,
    EmojiPickerContainer,
} from '../styles/pages/chat';
import {
    Sidebar,
    Profile,
    AddContact,
    CreateGroup,
} from "../components"
import { Avatar, IconButton as IButton } from "@material-ui/core";
import {
    Send as SendIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    InsertEmoticon as InsertEmoticonIcon,
    MoreVert as MoreVertIcon,
    Call as CallIcon,
    Videocam as VideocamIcon,
} from "@material-ui/icons";
import "emoji-mart/css/emoji-mart.css";
import { Picker, BaseEmoji } from "emoji-mart";

let socket = io.Socket;
const ENDPOINT = "ws://localhost:3001";

interface ChatI {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    theme: "light" | "dark";
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
};

export default function Chat({ token, setToken, theme, setTheme }: ChatI) {
    const [user, setUser] = useState<UserI>();

    const [currentContainer, setCurrentContainer] = useState<"profile" | "contacts" | "groups" | "addContact" | "createGroup">("contacts");

    const [currentContact, setCurrentContact] = useState<ContactI>();
    const [currentGroup, setCurrentGroup] = useState<GroupI>();

    const [message, setMessage] = useState("");

    const router = useRouter();

    const messagesContainerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        socket = io(ENDPOINT, { transports: ["websocket"] });
        const token = JSON.parse(localStorage.getItem("token"));

        if (!token) {
            router.push("/signin");
        };

        api.post(`/user/auth?access_token=${token}&user_required=true`).then(response => { // auth and get user
            const data = response.data;

            setToken(data.token);

            api.get(`/group?access_token=${token}&id=${data.user.id}`).then(response => { // get groups by last messages time
                const { groups } = response.data;

                data.user.groups = groups;

                const rooms: string[] = [];
                rooms.push(data.user.id);
                groups.forEach(group => rooms.push(group.id));

                api.get(`/contact?access_token=${token}&id=${data.user.id}`).then(response => { // get contacts by last messages time
                    const { contacts } = response.data;

                    data.user.contacts = contacts;

                    const contactsId: string[] = []
                    contacts.forEach(contact => contactsId.push(contact.id));

                    socket.emit("join", { rooms, contacts: contactsId }, (contactsOnline: string[]) => {
                        if (contactsOnline.length > 0) {
                            data.user.contacts.map((contact: ContactI) => {
                                if (contactsOnline.find(contactOnline => contact.id === contactOnline)) {
                                    contact.online = true;
                                } else {
                                    contact.online = false;
                                };

                                return contact;
                            });
                        };

                        setUser(data.user);
                    });
                });
            });
        }).catch(() => {
            router.push("/signin");
        });

        return () => {
            socket.disconnect();
            socket.off("private-message");
            socket.off("group-message");
            socket.off("contact-status-change");
            socket.off("is-online");
        };
    }, []);

    useEffect(() => {
        socket.on("private-message", ({ message }) => {
            const sender = message.sender_id;
            const receiver = message.contact.id;
            const unread_messages = message.contact.unread_messages;

            const existsContact = user?.contacts?.find(c => c.id === sender);

            if (!existsContact && user?.id === receiver) {
                api.get(`/contact/${sender}?access_token=${token}&user_id=${user?.id}`)
                    .then(response => {
                        const { contact } = response.data;

                        socket.emit("is-online", contact.id, (online: boolean) => {
                            contact.online = online;

                            const updatedContacts: ContactI[] = [contact];
                            user?.contacts?.forEach(c => updatedContacts.push(c))
                            setUser({
                                ...user,
                                contacts: updatedContacts,
                            })
                        });
                    });
            } else {
                let position: number;

                setUser({
                    ...user,
                    contacts: user?.contacts?.map((contact, i) => {
                        if (receiver === contact?.id || sender === contact?.id) { // update messages
                            const updatedMessages = contact?.messages?.map(msg => msg?.id === message?.id ? null : msg);
                            updatedMessages?.push(message);
                            contact.messages = updatedMessages;
                            contact.active = true;

                            position = i

                            if (user?.id === receiver) {
                                console.log(currentContact)
                                if (currentContact && currentContact.id === sender) {
                                    api.put(`/contact/message?access_token=${token}&only_unread_messages=true`, {
                                        unread_messages: 0,
                                        user_id: user?.id,
                                        contact_id: currentContact.id,
                                    });

                                    contact.unread_messages = undefined;
                                } else {
                                    contact.unread_messages = unread_messages;
                                };

                            };
                        };

                        return contact;
                    }),
                });

                if (position !== 0) {
                    setUser({
                        ...user,
                        contacts: changePosition(user?.contacts, position, 0),
                    });
                };
            };

            if (currentContact?.id === receiver || currentContact?.id === sender) {
                scrollToBottom(true);
            };
        });

        socket.on("group-message", ({ message, to }) => {
            //...
        });

        socket.on("contact-status-change", ({ contact_id, status }: { contact_id: string, status: "online" | "offline" }) => {
            setUser({
                ...user,
                contacts: user?.contacts?.map(contact => {
                    if (contact.id === contact_id)
                        contact.online = status === "online";

                    return contact;
                }),
            });
        });
    }, [user, currentContact, currentGroup]);

    useEffect(() => {
        scrollToBottom();

        if (currentContainer === "contacts" && currentContact && !(currentContact?.messages)) {
            api.get(`/contact/messages?access_token=${token}&id=${user?.id}&contact_id=${currentContact?.id}`)
                .then(response => {
                    const data = response.data;

                    setUser({
                        ...user,
                        contacts: user?.contacts?.map(contact => {
                            if (data.contact.contact_id === contact.id)
                                contact.messages = data.contact.messages;

                            return contact;
                        }),
                    });

                    scrollToBottom();
                });
        };

        if (currentContainer === "contacts" && currentContact && currentContact?.unread_messages > 0) {
            api.put(`/contact/message?access_token=${token}&only_unread_messages=true`, {
                unread_messages: 0,
                user_id: user?.id,
                contact_id: currentContact.id,
            }).then(() => {
                setUser({
                    ...user,
                    contacts: user?.contacts?.map(contact => {
                        if (currentContact.id === contact.id)
                            contact.unread_messages = undefined;

                        return contact;
                    }),
                });
            });
        };
    }, [currentContact, currentGroup]);

    async function privateMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setShowEmojiPicker(false);

        if (message.length > 0) {
            await api.post(`/contact/message?access_token=${token}`, {
                message,
                sender_id: user?.id,
                receiver_id: currentContact?.id,
                id_contact: currentContact?.id_contact
            }).then(response => {
                const { message, unread_messages } = response.data;

                socket.emit("private-message", { message, unread_messages }, () => setMessage(""));
            });
        };
    };

    async function groupMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (message.length > 0) {
            socket.emit("group-message", { message, from: user?.id, to: currentGroup })
        };
    };

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

    function onScroll() {
        if (messagesContainerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messagesContainerRef.current;

            if (!(scrollTop + 100 > scrollHeight - clientHeight)) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            };
        };
    };

    function changePosition<T extends any[]>(arr: T, from: number, to: number) {
        arr?.splice(to, 0, arr?.splice(from, 1)[0]);
        return arr;
    };

    return (
        <Container>
            <Head>
                <title>Zero | Chat</title>
            </Head>

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
                            <>
                                <Header>
                                    <Room>
                                        <Avatar src={currentGroup ? currentContact?.image : currentGroup?.image} />
                                        <h2>{currentContact ? currentContact.username : currentGroup.name}</h2>
                                    </Room>

                                    {currentContact ? (
                                        <>
                                            <IButton>
                                                <CallIcon />
                                            </IButton>

                                            <IButton>
                                                <VideocamIcon />
                                            </IButton>

                                        </>
                                    ) : null}

                                    <IButton>
                                        <MoreVertIcon />
                                    </IButton>
                                </Header>

                                <MessagesContainer ref={messagesContainerRef} onScroll={() => onScroll()}>
                                    {currentContact ?
                                        currentContact?.messages?.map((msg, i) => {
                                            return msg ? msg.sender_id === user?.id ? (
                                                <MessageSender key={i}>
                                                    {msg.message}
                                                </MessageSender>
                                            ) : (
                                                <Message key={i}>
                                                    {msg.message}
                                                </Message>
                                            )
                                                : null
                                        })
                                        :
                                        currentGroup?.messages?.map((msg, i) => {
                                            return msg ? msg.sender_id === user?.id ? (
                                                <MessageSender key={i}>
                                                    {msg.message}
                                                </MessageSender>
                                            ) : (
                                                <Message key={i}>
                                                    {msg.message}
                                                </Message>
                                            )
                                                : null
                                        })
                                    }

                                    {showScrollButton ? (
                                        <ScrollToBottom onClick={() => scrollToBottom()}>
                                            <KeyboardArrowDownIcon fontSize="large" />
                                        </ScrollToBottom>
                                    ) : null}
                                </MessagesContainer>

                                <FormContainer>
                                    {showEmojiPicker ? (
                                        <EmojiPickerContainer>
                                            <Picker onSelect={(emoji: BaseEmoji) => setMessage(message.concat(emoji.native))} />
                                        </EmojiPickerContainer>
                                    ) : null}

                                    <IconButton
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    >
                                        <InsertEmoticonIcon fontSize="large" />
                                    </IconButton>

                                    <Form onSubmit={currentContainer === "contacts" ? privateMessage : groupMessage}>
                                        <Input
                                            type="text"
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            autoComplete="off"
                                            onFocus={() => setShowEmojiPicker(false)}
                                        />

                                        <Submit type="submit">
                                            <SendIcon fontSize="large" />
                                        </Submit>
                                    </Form>
                                </FormContainer>
                            </>
                        )
                    ) :
                        currentContainer === "addContact" ? (
                            <AddContact
                                user={user}
                                setUser={setUser}
                                setCurrentContact={setCurrentContact}
                                setCurrentContainer={setCurrentContainer}
                                socket={socket}
                            />
                        ) :
                            currentContainer === "createGroup" ? (
                                <CreateGroup
                                    user={user}
                                />
                            ) : null
                }
            </Inner>
        </Container>
    );
};
