import Head from 'next/head';
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import { api, userService, socket } from "../services";
import { UserI } from "../types/user";
import { useSetUserMaster } from "../utils";
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import * as CallActions from '../store/actions/call'

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

    const [currentContainer, setCurrentContainer] = useState<'profile' | "messages" | "addContact" | "createGroup">("messages");

    const startingOrReceivingCall = useSelector((state: any) => state.call.startingOrReceiving)
    const currentRoom = useSelector((state: any) => state.currentRoom)

    const router = useRouter()
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) router.replace("/signin");

        userService.auth(token)
            .then(user => setUser(user))
            .catch(() => router.replace('/signin'));

        return () => {
            socket.disconnect();
            socket.off("private-message");
            socket.off("group-message");
            socket.off("contact");
            socket.off("group");
        };
    }, []);

    useEffect(() => {
        socket.once('ready', ({ contactsOnline }) => {
            setLoading(false);
        })

        socket.removeListener('private-message')
        socket.on("private-message", data => {
            const { receiver_id, message: { sender_id } } = data;
            setUserMaster.contacts.pushMessage({ where: [sender_id, receiver_id], data, currentContactId: currentRoom.room?.id });
        });

        socket.removeListener('group-message')
        socket.on("group-message", data => {
            setUserMaster.groups.pushMessage({ where: data.group_id, data, currentGroupId: currentRoom.room?.id });
        });

        socket.removeListener('contact')
        socket.on("contact", ({ event, data }) => {
            switch (event) {
                case "update":
                    const { where, set } = data;
                    setUserMaster.contacts.update({ where, set })
                    break;
            };
        });

        socket.removeListener('group')
        socket.on("group", ({ event, group }) => {
            switch (event) {
                case "new":
                    socket.emit("group", { event: "join", groupId: group.id }, () => {
                        setUserMaster.groups.push(group);
                    });
                    break;
            };
        });

        socket.removeListener('call-request')
        socket.on('call-request', ({ signal, callType, callFrom }) => {
            const userCall = user.contacts.find(contact => contact.id === callFrom);
            dispatch(CallActions.callRequest({ signal, callType, userCall }))
        });
    }, [user, currentRoom.room]);

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
                        theme={theme}
                        setTheme={setTheme}
                    />

                    <Inner>
                        {function () {
                            switch (currentContainer) {
                                case 'profile':
                                    return (
                                        <Profile
                                            user={user}
                                            setUserMaster={setUserMaster}
                                            theme={theme}
                                        />
                                    );
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
                                            setUserMaster={setUserMaster}
                                            theme={theme}
                                        />
                                    );
                                case 'addContact':
                                    return (
                                        <AddContact
                                            user={user}
                                            setUserMaster={setUserMaster}
                                            setCurrentContainer={setCurrentContainer}
                                        />
                                    );
                                case 'createGroup':
                                    return (
                                        <CreateGroup
                                            user={user}
                                            setUserMaster={setUserMaster}
                                            setCurrentContainer={setCurrentContainer}
                                            theme={theme}
                                        />
                                    );
                            };
                        }()}

                        {startingOrReceivingCall ? (<Call />) : null}
                    </Inner>
                </>
            ) : (<LoadingContainer theme={theme} />)}
        </Container>
    );
};
