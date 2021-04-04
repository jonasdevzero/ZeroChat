import Head from 'next/head';
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import { api, userService, socket } from "../services";
import { UserI, ContactI, GroupI } from "../types/user";
import { useSetUserMaster } from "../utils";
import Cookies from 'js-cookie';

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
    LoadingContainer,
    Call,
} from "../components"

interface ChatI {
    theme: "light" | "dark";
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>
};

export default function Chat({ theme, setTheme }: ChatI) {
    const [user, setUser] = useState<UserI>();
    const setUserMaster = useSetUserMaster(user, setUser);

    const [currentContainer, setCurrentContainer] = useState<"messages" | "addContact" | "createGroup" | undefined>("messages");

    const [currentRoom, setCurrentRoom] = useState<ContactI & GroupI>(undefined);
    const [currentRoomType, setCurrentRoomType] = useState<"contact" | "group">("contact");

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [startingOrReceivingCall, setStartingOrReceivingCall] = useState<'starting' | 'receiving'>(undefined);
    const [userCall, setUserCall] = useState<ContactI>(undefined); // call from or call to
    const [callerSignal, setCallerSignal] = useState(undefined);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) router.replace("/signin");

        socket.connect();
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        userService.get().then(data => {
            Cookies.set('token', data.token, { expires: 3 });
            setUser(data.user);
            setLoading(false);
        }).catch(() => {
            Cookies.remove('token')
            router.replace('/signin')
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
                setUserMaster.contacts.pushMessage({ where: [sender, receiver], message, currentContactId });
            };
        });

        socket.on("group-message", message => {
            const group_id = message.group_id, currentGroupId = currentRoom?.id;

            setUserMaster.groups.pushMessage({ where: group_id, message, currentGroupId });
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
                    socket.emit("group", { event: "join", groupId: group.id }, () => {
                        setUserMaster.groups.push(group);
                    });
                    break;
            };
        });

        socket.on("callRequest", ({ signal, callFrom }) => {
            setUserCall(user.contacts.find(contact => contact.id === callFrom));
            setCallerSignal(signal);
            setStartingOrReceivingCall('receiving');
        });
    }, [user, currentRoom]);

    function callUser(contact: ContactI) {
        setUserCall(contact);
        setStartingOrReceivingCall('starting');
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
                        currentContainer={currentContainer}
                        setCurrentContainer={setCurrentContainer}
                        setCurrentRoom={setCurrentRoom}
                        setCurrentRoomType={setCurrentRoomType}
                        theme={theme}
                        setTheme={setTheme}
                    />

                    <Inner>
                        {function () {
                            switch (currentContainer) {
                                case 'messages':
                                    if (!currentRoom) {
                                        return (
                                            <ContainerWithoutChat>
                                                <h1>Select or serach a room to chat</h1>
                                            </ContainerWithoutChat>
                                        );
                                    };

                                    return (
                                        <Messages
                                            user={user}
                                            currentRoom={currentRoom}
                                            currentRoomType={currentRoomType}
                                            setUserMaster={setUserMaster}
                                            callUser={callUser}
                                        />
                                    );
                                case 'addContact':
                                    return (
                                        <AddContact
                                            user={user}
                                            setUserMaster={setUserMaster}
                                            setCurrentRoom={setCurrentRoom}
                                            setCurrentRoomType={setCurrentRoomType}
                                            setCurrentContainer={setCurrentContainer}
                                        />
                                    );
                                case 'createGroup':
                                    return (
                                        <CreateGroup
                                            user={user}
                                            setUserMaster={setUserMaster}
                                            setCurrentRoom={setCurrentRoom}
                                            setCurrentRoomType={setCurrentRoomType}
                                            setCurrentContainer={setCurrentContainer}
                                            theme={theme}
                                        />
                                    );
                                default:
                                    return (
                                        <Profile
                                            user={user}
                                            setUserMaster={setUserMaster}
                                            theme={theme}
                                        />
                                    );
                            };
                        }()}

                        {startingOrReceivingCall ? (
                            <Call
                                userCall={userCall}
                                callerSignal={callerSignal}
                                startingOrReceivingCall={startingOrReceivingCall}
                            />
                        ) : null}
                    </Inner>
                </>
            ) : (<LoadingContainer theme={theme} />)}
        </Container>
    );
};
