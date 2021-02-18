import { useState, useEffect } from "react";
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
    TitleContainer,
    Title,
    ArrowBackButton,
    Wrapper,
    Input,
    Label,
    Submit,
    Span,
    Error,
    Info,
    StyledLink,
} from "../styles/components/Form";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

export default function SignIn({ setToken, setUser, token }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | undefined>();

    const router = useRouter();

    useEffect(() => {
        if (token) {
            api.post(`/user/auth?access_token=${token}&user_required=true`).then(response => {
                const { token, user } = response.data;

                setToken(token);
                setUser(user);

                return router.push("/chat");
            });
        };
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await api.post("/user/login", {
            email,
            password,
        }).then(response => {
            const { token, user } = response.data;

            setToken(token);
            setUser(user);

            return router.push("/chat");
        }).catch((err: AxiosError) => {
            const { message, fields } = err.response.data;

            fields.forEach((field: string) => {
                switch (field) {
                    case "email":
                        setEmail("");
                        break
                    case "password":
                        setPassword("");
                };
            });

            setError(message);
        });
    };

    return (
        <Container>
            <Head>
                <title>Zero | SignIn</title>
            </Head>

            <Form onSubmit={onSubmit}>
                <TitleContainer>
                    <ArrowBackButton type="button" onClick={() => router.back()}>
                        <ArrowBackIcon />
                    </ArrowBackButton>

                    <Title>SignIn</Title>
                </TitleContainer>

                {error ? (
                    <Error>
                        <strong>{error}</strong>
                    </Error>
                ) : null}

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

                <Submit type="submit">SignIn</Submit>

                <Info>
                    Forgot your password?
                    <Link href="/forgotPassword">
                        <StyledLink>
                            Click here
                        </StyledLink>
                    </Link>
                </Info>
                <Info>
                    No have an account?
                    <Link href="/signup">
                        <StyledLink>
                            Click here
                        </StyledLink>
                    </Link>
                </Info>
            </Form>
        </Container>
    );
};
