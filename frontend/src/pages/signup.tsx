import { useState } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import Link from "next/link";
import api from "../services/api";
import { AxiosError } from "axios";

import {
    Container,
    Form,
    TitleContainer,
    Title,
    ArrowBackButton,
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
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Warning from "../components/Warning";

export default function SignUp({ setToken, setUser, theme }) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string | undefined>();
    const [loadingRequest, setLoadingRequest] = useState(false);

    const [successWarning, setSuccessWarning] = useState(false);

    const router = useRouter();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoadingRequest(true);

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

            setName("");
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            setSuccessWarning(true);

            setTimeout(() => {
                return router.push("/chat");
            }, 2000);
        }).catch((err: AxiosError) => {
            const message = err?.response?.data?.message;
            const fields = err?.response?.data?.fields;

            fields.forEach((field: string) => {
                switch (field) {
                    case "username":
                        setUsername("");
                        break;
                    case "email":
                        setEmail("");
                        break;
                    case "password":
                        setPassword("");
                        setConfirmPassword("");
                };
            });

            setError(message);
        });

        setLoadingRequest(false);
    };

    return (
        <Container>
            <Head>
                <title>Zero | SignUp</title>
            </Head>

            <Warning showWarning={successWarning}>
                Welcome to Zero, redirecting...
            </Warning>

            <Form onSubmit={onSubmit}>
                <TitleContainer>
                    <ArrowBackButton type="button" onClick={() => router.back()}>
                        <ArrowBackIcon />
                    </ArrowBackButton>

                    <Title>SignUp</Title>
                </TitleContainer>

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

                <Submit type="submit">
                    {loadingRequest ? (
                        <img
                            src={`/loading-${theme}.svg`}
                            alt="loading"
                        />
                    ) : "SignUp"}
                </Submit>

                <Info>
                    Already have an account?
                    <Link href="/signin">
                        <StyledLink>
                            SignIn
                        </StyledLink>
                    </Link>
                </Info>
            </Form>
        </Container>
    );
};
