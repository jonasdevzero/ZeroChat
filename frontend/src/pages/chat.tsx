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
    Call,
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

    const [currentContainer, setCurrentContainer] = useState<"profile" | "messages" | "addContact" | "createGroup">("messages");

    const [currentRoom, setCurrentRoom] = useState<ContactI & GroupI>(undefined);
    const [currentRoomType, setCurrentRoomType] = useState<"contact" | "group">("contact");

    const messagesContainerRef = useRef(null);

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [startingCall, setStartingCall] = useState(false);
    const [callTo, setCallTo] = useState<ContactI>(undefined);

    const [receivingCall, setReceivingCall] = useState(false);
    const [callFrom, setCallFrom] = useState<ContactI>(undefined);
    const [callerSignal, setCallerSignal] = useState(undefined);

    useEffect(() => {
        socket = io(ENDPOINT, { transports: ["websocket"] });

        const token = JSON.parse(localStorage.getItem("token"));
        if (!token) {
            router.replace("/signin");
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
            router.replace("/signin");
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

        socket.on("private-message", message => {
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
                const currentContactId = currentRoom?.id;
                setUserMaster.contacts.pushMessage({ where: [sender, receiver], message, currentContactId }).then(() => {
                    if (currentRoom?.id === receiver || currentRoom?.id === sender) {
                        scrollToBottom(true);
                    };
                });
            };
        });

        socket.on("group-message", message => {
            const group_id = message.group_id, currentGroupId = currentRoom?.id;

            setUserMaster.groups.pushMessage({ where: group_id, message, currentGroupId }).then(() => {
                if (currentRoom?.id === group_id) {
                    scrollToBottom(true);
                };
            });
        });

        socket.on("user", ({ event, data }) => {
            switch (event) {
                case "update":
                    const { where, set } = data;
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

        socket.on("callRequest", ({ signal, callFrom }) => {
            console.log("Receiving a signal", signal)
            setCallFrom(user.contacts.find(contact => contact.id === callFrom));
            setCallerSignal(signal);
            setReceivingCall(true);
        })
    }, [user, currentRoom]);

    useEffect(() => {
        if (currentRoom && (currentContainer === "messages")) {
            const updateTag = currentRoomType === "contact" ? "contacts" : "groups";

            if (!(currentRoom?.messages)) {
                api.get(`/${currentRoomType}/messages?${currentRoomType}_id=${currentRoom.id}`).then(response => {
                    const { messages } = response.data;
                    setUserMaster[updateTag].update({ where: currentRoom.id, set: { messages } }).then(() => scrollToBottom());
                });
            };
            if (currentRoom.unread_messages > 0) {
                api.put(`/${currentRoomType}/${currentRoom.id}?unread_messages=true`).then(() => {
                    setUserMaster[updateTag].update({ where: currentRoom.id, set: { unread_messages: 0 } });
                });
            };
        };

        scrollToBottom();
    }, [currentRoom]);

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

    function callUser(contact: ContactI) {
        setCallTo(contact);
        setStartingCall(true);
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
                        currentContainer={currentContainer}
                        setCurrentContainer={setCurrentContainer}
                        setCurrentRoom={setCurrentRoom}
                        setCurrentRoomType={setCurrentRoomType}
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
                            currentContainer === "messages" ? (
                                !currentRoom ? (
                                    <ContainerWithoutChat>
                                        <h1>Select or serach a room to chat</h1>
                                    </ContainerWithoutChat>
                                ) : (
                                    <Messages
                                        user={user}
                                        socket={socket}
                                        currentRoom={currentRoom}
                                        currentRoomType={currentRoomType}
                                        messagesContainerRef={messagesContainerRef}
                                        scrollToBottom={scrollToBottom}
                                    />
                                )
                            ) :
                                currentContainer === "addContact" ? (
                                    <AddContact
                                        user={user}
                                        setUserMaster={setUserMaster}
                                        setCurrentRoom={setCurrentRoom}
                                        setCurrentRoomType={setCurrentRoomType}
                                        setCurrentContainer={setCurrentContainer}
                                        socket={socket}
                                    />
                                ) :
                                    currentContainer === "createGroup" ? (
                                        <CreateGroup
                                            user={user}
                                            setUserMaster={setUserMaster}
                                            setCurrentRoom={setCurrentRoom}
                                            setCurrentRoomType={setCurrentRoomType}
                                            setCurrentContainer={setCurrentContainer}
                                            socket={socket}
                                        />
                                    ) : null
                        }

                        {startingCall || receivingCall ? (
                            <Call
                                socket={socket}
                                startingCall={startingCall}
                                receivingCall={receivingCall}
                                callTo={callTo}
                                callFrom={callFrom}
                                callerSignal={callerSignal}
                            />
                        ) : null}
                    </Inner>
                </>
            ) : (
                <Loading theme={theme} />
            )}
        </Container>
    );
};
