import Head from 'next/head';
import { useState, useEffect } from 'react'
import io from 'socket.io-client';

import {
    Container,
    MessagesContainer,
    Message,
    Form,
    Input,
    Submit,
} from '../styles/pages/chat';

let socket = io.Socket

export default function Chat() {
    const ENDPOINT = "localhost:3001"

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket = io(ENDPOINT);

        const data = JSON.parse(localStorage.getItem("chat-data"));

        socket.emit("join", { name: data.user, room: data.room }, () => { });

        return () => {
            socket.emit("leave");
        };
    }, [ENDPOINT]);

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);


    function sendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (message.length > 0) {
            socket.emit("sendMessage", message, () => setMessage(""));
        };
    };

    return (
        <>
            <Head>
                <title>chat</title>
            </Head>

            <Container>
                <MessagesContainer>
                    {messages?.map((message, i) => <Message key={i}>{message}</Message>)}
                </MessagesContainer>

                <Form onSubmit={sendMessage}>
                    <Input value={message} onChange={e => setMessage(e.target.value)} />
                    <Submit type='submit'>Submit</Submit>
                </Form>
            </Container>
        </>
    );
};
