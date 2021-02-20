import { useState, useEffect } from "react";
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

export default function SignIn({ setToken, setUser, token, theme }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const [successWarning, setSuccessWarning] = useState(undefined);

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

        setLoading(true);

        await api.post("/user/login", {
            email,
            password,
        }).then(response => {
            const { token, user } = response.data;

            setToken(token);
            setUser(user);

            setEmail("");
            setPassword("");

            setLoading(false);
            setSuccessWarning(true);

            setTimeout(() => {
                return router.push("/chat");
            }, 2000);
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

            setLoading(false);
            setError(message);
        });
    };

    return (
        <Container>
            <Head>
                <title>Zero | SignIn</title>
            </Head>

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

                <Submit type="submit">
                    {loading ? (
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
        </Container>
    );
};
