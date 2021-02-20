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
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);

        await api.post("/user/forgot_password", { email }).then(response => {
            setLoading(false)
            setSuccessWarning(true);
        }).catch((err: AxiosError) => {
            const { message } = err.response.data;

            setError(message);
            setLoading(false);
        });
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
                    {loading ? (
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
