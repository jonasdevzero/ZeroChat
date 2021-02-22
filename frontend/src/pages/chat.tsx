import Head from 'next/head';
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import api from "../services/api";

import {
    Container,
    Inner,
    Header,
    MessagesContainer,
    Message,
    MessageSender,
    Form,
    Input,
    Submit,
} from '../styles/pages/chat';
import { Sidebar } from "../components"

let socket = io.Socket;
const ENDPOINT = "localhost:3001";

export default function Chat({ user, setUser, setToken }) {

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const router = useRouter();

    // useEffect(() => {
    //     const token = JSON.parse(localStorage.getItem("token"));

    //     if (!user) {
    //         api.post(`/user/auth?access_token=${token}&user_required=true`).then(response => {
    //             const data = response.data;

    //             setUser(data.user);
    //             setToken(data.token);
    //         }).catch(() => router.push("/signin"));
    //     };

    //     socket = io(ENDPOINT);

    //     socket.emit("join", { name: user?.username, room: "0" }, () => { });

    //     return () => {
    //         socket?.emit("leave");
    //     };
    // }, [ENDPOINT]);

    // useEffect(() => {
    //     socket?.on("message", (message) => {
    //         setMessages([...messages, message]);
    //     });
    // }, [messages]);

    function sendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // if (message.length > 0) {
        //     socket.emit("sendMessage", message, () => setMessage(""));
        // };
    };

    return (
        <Container>
            <Head>
                <title>Zero | Chat</title>
            </Head>

            <Sidebar />

            <Inner>
                <Header>
                    Chat name
                </Header>

                <MessagesContainer>
                    {messages?.map((msg, i) => {
                        msg.senderId === user?.id ? (
                            <MessageSender>
                                {msg.content}
                            </MessageSender>
                        ) : (
                                <Message>
                                    {msg.content}
                                </Message>
                            )
                    })}
                </MessagesContainer>

                <Form>
                    <Input />
                    <Submit>Send</Submit>
                </Form>
            </Inner>
        </Container>
    );
};
