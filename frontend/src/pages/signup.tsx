import { useState } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import Link from "next/link";
import api from "../services/api";
import { AxiosError } from "axios";

import {
    Container,
} from "../styles/pages/signup";
import {
    Form,
    Title,
    Wrapper,
    WrapperInputs,
    Input,
    Label,
    Submit,
    Span,
    Error,
    Info,
    StyledLink,
} from "../styles/components/Form";

export default function SignUp({ setToken, setUser }) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string | undefined>();


    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await api.post("/user", {
            name,
            username,
            email,
            password,
            confirmPassword,
        }).then(response => {
            const { user, token } = response.data;

            setUser(user);
            setToken(token);

            const router = useRouter();
            router.push("/chat");
        }).catch((err: AxiosError) => {
            const { error } = err.response.data;

            setError(error);

            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        });
    };

    return (
        <Container>
            <Head>
                <title>Zero | SignUp</title>
            </Head>

            <Form onSubmit={onSubmit}>
                <Title>SignUp</Title>

                {error ? (
                    <Error>
                        <strong>{error}</strong>
                    </Error>
                ) : null}

                <WrapperInputs>
                    <Wrapper>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            autoComplete="off"
                            type="text"
                        />
                        <Label>
                            <Span>Name</Span>
                        </Label>
                    </Wrapper>

                    <Wrapper>
                        <Input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoComplete="off"
                            type="text"
                        />
                        <Label>
                            <Span>Username</Span>
                        </Label>
                    </Wrapper>
                </WrapperInputs>

                <Wrapper>
                    <Input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                        type="text"
                    />
                    <Label>
                        <Span>Email</Span>
                    </Label>
                </Wrapper>

                <WrapperInputs>
                    <Wrapper>
                        <Input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="off"
                            type="password"
                        />
                        <Label>
                            <Span>Password</Span>
                        </Label>
                    </Wrapper>

                    <Wrapper>
                        <Input
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="off"
                            type="password"
                        />
                        <Label>
                            <Span>Confirm Password</Span>
                        </Label>
                    </Wrapper>
                </WrapperInputs>

                <Submit>SignUp</Submit>

                <Info>
                    Already have an account?
                    <Link href="/signin">
                        <StyledLink>
                            Click here
                        </StyledLink>
                    </Link>
                </Info>
            </Form>
        </Container>
    );
};
