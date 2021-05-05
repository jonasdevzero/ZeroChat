import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from 'next/head';
import Link from "next/link";
import api from "../services/api";
import { AxiosError } from "axios";
import Cookies from 'js-cookie';

import {
    Container,
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
import Warning from "../components/Warning";
import { LoadingContainer } from "../components";

export default function SignIn({ theme }) {
    const [reference, setReference] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | undefined>();
    const [loadingRequest, setLoadingRequest] = useState(false);

    const [successWarning, setSuccessWarning] = useState(undefined);

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            setLoading(true);
            router.push("/chat");
        };
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoadingRequest(true);

        await api.post("/user/login", { reference, password }).then(response => {
            const { token } = response.data;
            Cookies.set('token', token);

            setReference("");
            setPassword("");

            setSuccessWarning(true);
            setTimeout(() => {
                setLoading(true);
                router.push("/chat");
            }, 2000);
        }).catch((err: AxiosError) => {
            const { message } = err.response.data;
            setError(message);
        });

        setLoadingRequest(false);
    };

    return (
        <Container>
            <Head>
                <title>Zero | SignIn</title>
            </Head>

            {!loading ? (
                <>
                    <Warning showWarning={successWarning}>
                        Successful login, redirecting...
                    </Warning>

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
                                value={reference}
                                onChange={e => setReference(e.target.value)}
                                required
                                autoComplete="off"
                                type="text"
                            />
                            <Label>
                                <Span>Email or Username</Span>
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

                        <Submit type="submit">
                            {loadingRequest ? (
                                <img
                                    src={`/loading-${theme}.svg`}
                                    alt="loading"
                                />
                            ) : "SignIn"}
                        </Submit>

                        <Info>
                            Forgot password?
                            <Link href="/forgotPassword">
                                <StyledLink>
                                    Click here
                                </StyledLink>
                            </Link>
                        </Info>
                        <Info>
                            Don't have an account?
                            <Link href="/signup">
                                <StyledLink>
                                    SignUp
                                </StyledLink>
                            </Link>
                        </Info>
                    </Form>
                </>
            ) : (
                <LoadingContainer theme={theme} />
            )}

        </Container>
    );
};