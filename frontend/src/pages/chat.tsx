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
    ContainerWithoutChat,
    MessagesContainer,
    Message,
    MessageSender,
    Form,
    Input,
    Submit,
    ScrollToBottom,
    Wrapper,
} from '../styles/pages/chat';
import { Sidebar } from "../components"
import { Avatar } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

let socket = io.Socket;
const ENDPOINT = "localhost:3001";

interface ChatI {
    user: UserI;
    setUser: React.Dispatch<React.SetStateAction<UserI>>;
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
};

export default function Chat({ user, setUser, setToken, token }: ChatI) {

    const [currentRoomType, setCurrentRoomType] = useState<"contacts" | "groups">("contacts");
    const [currentContact, setCurrentContact] = useState<ContactI>();
    const [currentGroup, setCurrentGroup] = useState<GroupI>();

    const [message, setMessage] = useState("");

    const router = useRouter();

    const privateMessages = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        socket = io(ENDPOINT);
        const token = JSON.parse(localStorage.getItem("token"));

        api.post(`/user/auth?access_token=${token}&user_required=true`).then(response => {
            const data = response.data;

            setUser(data.user);
            setToken(data.token);

            const rooms: string[] = [];
            rooms.push(data.user.id);
            data.user.groups.forEach(group => rooms.push(group.id));

            socket.emit("start", rooms, () => { });
        }).catch(() => {
            return router.push("/signin");
        });

        return () => {
            socket.off("start");
            socket.off("privateMessage");
            socket.off("sendPrivateMessage");
            socket.off("groupMessage");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("privateMessage", (message) => {
            const sender = message.sender_id;
            const receiver = message.contact.contact_id;

            setUser({
                ...user,
                contacts: user?.contacts?.map(contact => {
                    if (receiver === contact?.id || sender === contact?.id) {
                        const updatedMessages = contact?.messages?.map(msg => msg?.id === message?.id ? null : msg);
                        updatedMessages.push(message);

                        contact.messages = updatedMessages;
                        return contact;
                    }

                    return contact;
                }),
            });

            scrollToBottom(true);
        });

        socket.on("groupMessage", ({ message, to }) => {
            //...
        });
    }, [currentContact?.messages]);

    useEffect(() => {
        scrollToBottom();
    }, [currentContact, currentGroup]);

    async function privateMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (message.length > 0) {
            await api.post(`/contact/message?access_token=${token}`, {
                message,
                sender_id: user?.id,
                receiver_id: currentContact?.id,
            }).then(response => {
                const { message } = response.data;

                socket.emit("sendPrivateMessage", message, () => setMessage(""));
            });
        };
    };

    function groupMessage(e: React.FormEvent<HTMLFormElement>) {
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
                currentRoomType={currentRoomType}
                setCurrentRoomType={setCurrentRoomType}

                setCurrentContact={setCurrentContact}
                setCurrentGroup={setCurrentGroup}
            />

            <Inner>
                {!currentContact || currentGroup ? (
                    <ContainerWithoutChat>
                        <h1>Select a room to chat</h1>
                    </ContainerWithoutChat>
                ) : (
                        <>
                            <Header>
                                <Avatar src={currentRoomType === "contacts" ? currentContact?.image : currentGroup?.image} />
                                <h2>{currentRoomType === "contacts" ? currentContact?.username : currentGroup?.name}</h2>
                            </Header>

                            <MessagesContainer ref={privateMessages} onScroll={() => onScroll()}>
                                {currentContact?.messages?.map((msg, i) => {
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
                                })}

                                {showScrollButton ? (
                                    <ScrollToBottom onClick={() => scrollToBottom()}>
                                        <KeyboardArrowDownIcon fontSize="large" />
                                    </ScrollToBottom>
                                ) : null}
                            </MessagesContainer>

                            <Form onSubmit={currentRoomType === "contacts" ? privateMessage : groupMessage}>
                                <Wrapper>
                                    <Input value={message} onChange={e => setMessage(e.target.value)} />
                                    <Submit>
                                        <SendIcon fontSize="large" />
                                    </Submit>
                                </Wrapper>
                            </Form>
                        </>
                    )}
            </Inner>
        </Container>
    );
};
