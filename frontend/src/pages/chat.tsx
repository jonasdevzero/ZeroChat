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

        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        api.post(`/user/auth?user_required=true`).then(response => { // auth and get user
            const data = response.data;

            setToken(data.token);

            api.get(`/group`).then(response => { // get groups by last messages time
                const groups: Array<{ [key: string]: any }> = response.data.groups || [];

                data.user.groups = groups.map(g => {
                    const user = g.users.find((u: GroupUserI) => u?.id === data.user.id);
                    g.unread_messages = user.unread_messages;

                    return g;
                });

                const rooms: string[] = [];
                rooms.push(data.user.id);
                groups.forEach(group => rooms.push(group.id));

                api.get(`/contact`).then(response => { // get contacts by last messages time
                    const { contacts } = response.data;
                    data.user.contacts = contacts || [];

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
        socket.on("private-message", ({ message }) => {
            const sender = message.sender_id, receiver = message.contact.id;

            const existsContact = user?.contacts?.find(c => c?.id === sender);
            if (!existsContact && user?.id === receiver) {
                api.get(`/contact/${sender}`).then(response => {
                    const contact: ContactI = response.data.contact;

                    socket.emit("user", { contactId: contact.id, event: "addContact" }, (isOnline: boolean) => {
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
            const group_id = message.group_id, currentGrouptId = currentGroup?.id;

            setUserMaster.groups.pushMessage({ where: group_id, message, currentGrouptId }).then(() => {
                if (currentGroup?.id === group_id) {
                    scrollToBottom(true);
                };
            });
        });

        socket.on("user", ({ event, contact_id, username, picture, status }) => {
            switch (event) {
                case "update":
                    setUserMaster.contacts.update({ where: contact_id, set: { username, image: picture } });
                    break;
                case "status":
                    setUserMaster.contacts.update({ where: contact_id, set: { online: status } });
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

        if (currentContainer === "contacts" && currentContact && !(currentContact?.messages)) {
            api.get(`/contact/messages?contact_id=${currentContact?.id}`).then(response => {
                const { contact_id, messages } = response.data.contact;
                setUserMaster.contacts.update({ where: contact_id, set: { messages } }).then(() => scrollToBottom());
            });
        };

        if (currentContainer === "contacts" && currentContact && currentContact?.unread_messages > 0) {
            api.put(`/contact/${currentContact?.id}?unread_messages=true`).then(() => {
                setUserMaster.contacts.update({ where: currentContact.id, set: { unread_messages: 0 } });
            });
        };

        if (currentContainer === "groups" && currentGroup && !(currentGroup?.messages)) {
            api.get(`/group/messages?group_id=${currentGroup?.id}`).then(response => {
                const { messages } = response.data;
                setUserMaster.groups.update({ where: currentGroup.id, set: { messages } }).then(() => scrollToBottom());
            });
        };
    }, [currentContact, currentGroup]);

    async function privateMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setShowEmojiPicker(false);
        const receiver_id = currentContact?.id, id_contact = currentContact?.id_contact;

        if (message.length > 0) {
            await api.post(`/contact/message`, { message, receiver_id, id_contact }).then(response => {
                const { message, unread_messages } = response.data;
                socket.emit("private-message", { message, unread_messages }, () => setMessage(""));
            });
        };
    };

    async function groupMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (message.length > 0) {
            await api.post(`/group/message`, { group_id: currentGroup?.id, message }).then(response => {
                const { message } = response.data;
                socket.emit("group-message", { message }, () => setMessage(""));
            });
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
                            <>
                                <Header>
                                    <Room>
                                        <Avatar src={currentContainer === "contacts" ? currentContact?.image : currentGroup?.image} />
                                        <h2>{currentContainer === "contacts" ? currentContact?.username : currentGroup?.name}</h2>
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
        </Container>
    );
};
