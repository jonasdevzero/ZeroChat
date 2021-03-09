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
    Contact,
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
import { Sidebar } from "../components"
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
    const [user, setUser] = useState<UserI>()

    const [currentRoomType, setCurrentRoomType] = useState<"contacts" | "groups">("contacts");
    const [currentContact, setCurrentContact] = useState<ContactI>();
    const [currentGroup, setCurrentGroup] = useState<GroupI>();

    const [message, setMessage] = useState("");

    const router = useRouter();

    const privateMessages = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        socket = io(ENDPOINT, { transports: ["websocket"] });
        const token = JSON.parse(localStorage.getItem("token"));

        if (!token) {
            router.push("/signin");
        };

        api.post(`/user/auth?access_token=${token}&user_required=true`).then(response => {
            const data = response.data;

            setToken(data.token);

            const rooms: string[] = [];
            rooms.push(data.user.id);
            data.user.groups.forEach(group => rooms.push(group.id));

            const contacts: string[] = []
            data.user.contacts.forEach(contact => contacts.push(contact.id));

            socket.emit("join", { rooms, contacts }, (contactsOnline: string[]) => {
                if (contactsOnline.length > 0) {
                    data.user.contacts.map((contact: ContactI) => {
                        if (contactsOnline.find(contactOnline => contact.id === contactOnline)) {
                            contact.online = true
                            return contact;
                        };

                        contact.online = false;
                        return contact;
                    })
                };

                setUser(data.user);
            });
        }).catch(() => {
            router.push("/signin");
        });

        return () => {
            socket.off("start");
            socket.off("privateMessage");
            socket.off("sendPrivateMessage");
            socket.off("groupMessage");
            socket.off("userJoin");
            socket.off("userLeft");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("privateMessage", ({ message, senderContact, unread_messages }) => {
            const sender = message.sender_id;
            const receiver = message.contact.contact_id;

            if (!(user?.contacts?.find(c => c?.id === sender)) && user?.id !== sender) {
                const updatedContacts = user?.contacts;
                updatedContacts?.unshift(senderContact);

                setUser({
                    ...user,
                    contacts: updatedContacts
                })
            } else {
                setUser({
                    ...user,
                    contacts: user?.contacts?.map(contact => {
                        if (receiver === contact?.id || sender === contact?.id) {
                            const updatedMessages = contact?.messages?.map(msg => msg?.id === message?.id ? null : msg);
                            updatedMessages?.push(message);
                            contact.messages = updatedMessages;

                            if (user?.id === receiver && contact?.id === sender) {
                                if (currentContact?.id === sender) {
                                    api.put(`/contact/message?access_token=${token}&only_unread_messages=true`, {
                                        unread_messages: 0,
                                        user_id: user?.id,
                                        contact_id: currentContact.id,
                                    });

                                    contact.unread_messages = null;
                                } else {
                                    contact.unread_messages = unread_messages;
                                };
                            };

                            return contact;
                        }

                        return contact;
                    }),
                });
            };

            if (currentContact?.id === receiver || currentContact?.id === sender) {
                scrollToBottom(true);
            };
        });

        socket.on("groupMessage", ({ message, to }) => {
            //...
        });

        socket.on("userJoin", (userId: string) => {
            setUser({
                ...user,
                contacts: user?.contacts?.map(contact => {
                    if (contact.id === userId) {
                        contact.online = true;
                        return contact;
                    };

                    return contact;
                }),
            });
        });

        socket.on("userLeft", (userId: string) => {
            setUser({
                ...user,
                contacts: user?.contacts?.map(contact => {
                    if (contact.id === userId) {
                        contact.online = false;
                        return contact;
                    };

                    return contact;
                }),
            });
        });
    }, [user]);

    useEffect(() => {
        scrollToBottom();

        if (currentRoomType === "contacts" && currentContact && !(currentContact?.messages)) {
            api.get(`/contact/messages?access_token=${token}&id=${user?.id}&contact_id=${currentContact?.id}`)
                .then(response => {
                    const data = response.data;

                    setUser({
                        ...user,
                        contacts: user?.contacts?.map(contact => {
                            if (data.contact.contact_id === contact.id) {

                                contact.messages = data.contact.messages;
                                return contact;
                            }

                            return contact;
                        }),
                    });

                    scrollToBottom();
                });
        };

        if (currentRoomType === "contacts" && currentContact && currentContact.unread_messages) {
            api.put(`/contact/message?access_token=${token}&only_unread_messages=true`, {
                unread_messages: 0,
                user_id: user?.id,
                contact_id: currentContact.id,
            }).then(() => {
                setUser({
                    ...user,
                    contacts: user?.contacts?.map(contact => {
                        if (currentContact.id === contact.id) {

                            contact.unread_messages = null;
                            return contact;
                        }

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
            }).then(response => {
                const { message, senderContact, unread_messages } = response.data;

                socket.emit("sendPrivateMessage", { message, senderContact, unread_messages }, () => setMessage(""));
            });
        };
    };

    async function groupMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (message.length > 0) {
            socket.emit("sendGroupMessage", { message, from: user?.id, to: currentGroup })
        };
    };

    function scrollToBottom(newMessage?: boolean) {
        if (privateMessages.current) {
            const { scrollTop, clientHeight, scrollHeight } = privateMessages.current;
            const scroll = scrollHeight - clientHeight;

            if (newMessage) {
                if (scrollTop + 200 > scrollHeight - clientHeight) {
                    privateMessages.current.scrollTo(0, scroll);
                };
            } else {
                privateMessages.current.scrollTo(0, scroll);
            };
        };
    };

    function onScroll() {
        if (privateMessages.current) {
            const { scrollTop, clientHeight, scrollHeight } = privateMessages.current;

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

                currentRoomType={currentRoomType}
                setCurrentRoomType={setCurrentRoomType}

                setCurrentContact={setCurrentContact}
                setCurrentGroup={setCurrentGroup}

                theme={theme}
                setTheme={setTheme}
            />

            <Inner>
                {!currentContact && !currentGroup ? (
                    <ContainerWithoutChat>
                        {currentRoomType === "contacts" ? (
                            <h1>Select a contact to chat</h1>
                        ) : (
                            <h1>Select a group to chat</h1>
                        )}
                    </ContainerWithoutChat>
                ) : (
                    <>
                        <Header>
                            <Contact>
                                <Avatar src={currentRoomType === "contacts" ? currentContact?.image : currentGroup?.image} />
                                <h2>{currentRoomType === "contacts" ? currentContact?.username : currentGroup?.name}</h2>
                            </Contact>

                            <IButton>
                                <CallIcon />
                            </IButton>

                            <IButton>
                                <VideocamIcon />
                            </IButton>

                            <IButton>
                                <MoreVertIcon />
                            </IButton>
                        </Header>

                        <MessagesContainer ref={privateMessages} onScroll={() => onScroll()}>
                            {currentRoomType === "contacts" ?
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

                            <Form onSubmit={currentRoomType === "contacts" ? privateMessage : groupMessage}>
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
                )}
            </Inner>
        </Container>
    );
};
