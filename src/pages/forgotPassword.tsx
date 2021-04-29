import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
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
} from "../styles/components/Form";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Warning from "../components/Warning";

export default function forgotPassword({ theme }) {
    const [email, setEmail] = useState("");

    const [error, setError] = useState<string | undefined>("");
    const [successWarning, setSuccessWarning] = useState(undefined);
    const [loadingRequest, setLoadingRequest] = useState(false);

    const router = useRouter();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoadingRequest(true);

        await api.post("/user/forgot_password", { email }).then(response => {
            setEmail("");

            setSuccessWarning(true);
            setTimeout(() => {
                setSuccessWarning(undefined);
            }, 2500);
        }).catch((err: AxiosError) => {
            const { message } = err.response.data;

            setError(message);
        });

        setLoadingRequest(false);
    };

    return (
        <Container>
            <Head>
                <title>Zero | Forgot Password</title>
            </Head>

            <Warning showWarning={successWarning}>
                Check your email...
            </Warning>

            <Form onSubmit={onSubmit}>
                <TitleContainer>
                    <ArrowBackButton type="button" onClick={() => router.back()}>
                        <ArrowBackIcon />
                    </ArrowBackButton>

                    <Title>Forgot Password</Title>
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

                <Submit type="submit">
                    {loadingRequest ? (
                        <img
                            src={`/loading-${theme}.svg`}
                            alt="loading"
                        />
                    ) : "Submit"}
                </Submit>
            </Form>
        </Container>
    );
};
