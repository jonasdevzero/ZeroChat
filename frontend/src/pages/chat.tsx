import Head from 'next/head';
import { useRouter } from 'next/router';
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
    const { query } = useRouter();

    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const ENDPOINT = "localhost:3001"

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket = io(ENDPOINT);

        const { name, room } = query;

        setName(String(name));
        setRoom(String(room));

        socket.emit("join", room, () => { });

        return () => {
            socket.off("join");
        };
    }, [ENDPOINT, query]);

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);


    function sendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        socket.emit("sendMessage", { message, room }, () => {
            setMessage("");
        });
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
