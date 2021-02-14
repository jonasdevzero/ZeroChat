import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

import {
    Container,
    Form,
    Input,
    Button,
} from '../styles/pages/home';

export default function Home() {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    const router = useRouter();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        router.push(`/chat?name=${name}&room=${room}`);
    };

    return (
        <>
            <Head>
                <title>zero.io</title>
            </Head>

            <Container>
                <h1>Zero.io Chat 0.1v</h1>

                <Form onSubmit={onSubmit}>
                    <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="name" />
                    <Input type="text" value={room} onChange={e => setRoom(e.target.value)} placeholder="room" />
                    <Button type='submit'>Sign In</Button>
                </Form>
            </Container>
        </>
    )
}
