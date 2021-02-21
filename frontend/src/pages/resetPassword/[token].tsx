import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import api from "../../services/api";
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
} from "../../styles/components/Form";
import Warning from "../../components/Warning";

export default function forgotPassword({ theme }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string | undefined>("");
    const [successWarning, setSuccessWarning] = useState(undefined);
    const [loadingRequest, setLoadingRequest] = useState(false);

    const router = useRouter();
    const { token } = router.query;

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoadingRequest(true);

        await api.put("/user/reset_password", {
            resetToken: token,
            password,
            confirmPassword,
        }).then(response => {
            setPassword("");
            setConfirmPassword("");

            setSuccessWarning(true);

            setTimeout(() => {
                router.push("/signin");
            }, 2000);
        }).catch((err: AxiosError) => {
            const { message } = err.response.data;

            setPassword("");
            setConfirmPassword("");

            setError(message);
        });

        setLoadingRequest(false);
    };

    return (
        <Container>
            <Head>
                <title>Zero | Reset Password</title>
            </Head>

            <Warning showWarning={successWarning}>
                Successful password change, redirection...
            </Warning>

            <Form onSubmit={onSubmit}>
                <TitleContainer>
                    <Title>Reset Password</Title>
                </TitleContainer>

                {error ? (
                    <Error>
                        <strong>{error}</strong>
                    </Error>
                ) : null}

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
