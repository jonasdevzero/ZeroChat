import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { UserI } from "../types/user";
import api from "../services/api";
import { AxiosError } from "axios";
import { SetUserMasterI } from "../types/useSetUserMaster";

import {
    Info,
    InputContainer,
    InputsWrapper,
    Message,
    WrapperScreen,
    Screen,
    Fill,
    Close,
} from "../styles/components/Profile";
import {
    Container,
    Header,
    Inner,
    Form,
    InputWrapper,
    Label,
    Input,
    Button,
    Wrapper,
    ImageWrapper,
    ImageLabel,
    ImageInput,
    RemoveImage,
    ErrorMessage,
} from "../styles/components/Container";
import Warning from "./Warning";
import { Avatar } from "@material-ui/core";
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Close as CloseIcon,
    CloudUpload as CloudUploadIcon,
} from '@material-ui/icons';

interface ProfileI {
    user: UserI;
    setUserMaster: SetUserMasterI;
    theme: "light" | "dark";
    setToken: React.Dispatch<React.SetStateAction<string>>;
    socket: SocketIOClient.Socket;
};

export default function Profile({ user, setUserMaster, theme, setToken, socket }: ProfileI) {
    const [name, setName] = useState(user?.name);
    const [username, setUsername] = useState(user?.username);
    const [picture, setPicture] = useState(user?.picture);
    const [newPicture, setNewPicture] = useState<File>(undefined);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showEmail, setShowEmail] = useState(false);

    const [showMessage, setShowMessage] = useState(false);

    const [updateEmailScreen, setUpdateEmailScreen] = useState(false);
    const [deleteAccountScreen, setDeleteAccountScreen] = useState(false);

    const [warning, setWarning] = useState("");

    const [error, setError] = useState("");
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [currentRequest, setCurrentRequest] = useState<"data" | "email" | "password" | "delete">("data");

    const router = useRouter();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData();
        data.append("name", name);
        data.append("username", username);
        data.append("picture", newPicture);

        if (name !== user?.name || username !== user?.username || picture !== user?.picture) {
            setCurrentRequest("data");
            setLoadingRequest(true);
            setError("");

            await api.put(`/user?without_image=${picture?.length === 0}`, data).then(response => {
                const { user: { name, username, picture } } = response.data;

                setUserMaster.update({ name, username, picture });
                setWarning("Updated with success!");

                socket.emit("user", { event: "update", data: { where: user?.id, set: { username, image: picture } } }, () => { });
            }).catch((error: AxiosError) => {
                const { message } = error.response.data;
                setError(message);
            });

            setLoadingRequest(false);
        };
    };

    async function changeEmail(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setCurrentRequest("email");
        setLoadingRequest(true);
        setError("");

        await api.put(`/user?update_email=true`, { email, password }).then(response => {
            setUserMaster.update({ email });

            closeScreen();
            setWarning("Updated with success");
        }).catch((error: AxiosError) => {
            const { message } = error?.response?.data;
            setError(message);
        });

        setLoadingRequest(false);
    };

    async function changePassword() {
        setLoadingRequest(true);
        setCurrentRequest("password");

        await api.post("user/forgot_password", { email }).then(response => {
            setLoadingRequest(false);
            setWarning(response.data.message);
        });
    };

    async function deleteAccount(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setCurrentRequest("delete");
        setLoadingRequest(true);
        setError("");

        await api.post(`/user/delete`, { password }).then(_ => {
            setWarning("Deleted with success, redirecting...");
            setToken("");
            closeScreen();

            setTimeout(() => router.push("/"), 2000);
        }).catch((error: AxiosError) => {
            const { message } = error?.response?.data;
            setError(message);
        });

        setLoadingRequest(false);
    };

    function closeScreen() {
        setUpdateEmailScreen(false);
        setDeleteAccountScreen(false);
        setEmail("");
        setPassword("");
        setError("");
    };

    function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;

        const selectedImage = Array.from(e.target.files)[0];
        setNewPicture(selectedImage);

        const imagePreview = URL.createObjectURL(selectedImage);

        setPicture(imagePreview);
    };

    function removeSelectedImage() {
        setNewPicture(undefined);
        setPicture("");
    };

    function resentInputs() {
        setName(user?.name);
        setUsername(user?.username);
        setPicture(user?.picture);
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (warning.length > 0) {
            setTimeout(() => setWarning(""), 2000);
        };

        if (showMessage) {
            timeout = setTimeout(() => setShowMessage(false), 3000);
        };

        return () => {
            clearTimeout(timeout);
        }
    }, [warning, showMessage]);

    return (
        <Container>
            <Header>
                <h1>Profile</h1>
            </Header>

            <Inner>
                <Info>
                    <ImageWrapper>
                        {!picture ? (
                            <>
                                <ImageLabel htmlFor="image">
                                    <CloudUploadIcon fontSize="large" />
                                </ImageLabel>

                                <ImageInput
                                    id="image"
                                    type="file"
                                    onChange={handleSelectImage}
                                />
                            </>
                        ) : (
                            <RemoveImage type="button" onClick={() => removeSelectedImage()}>
                                <CloseIcon fontSize="large" />
                            </RemoveImage>
                        )}
                        <Avatar src={picture} />
                    </ImageWrapper>

                    <Wrapper>
                        <h3>{name}</h3>
                        <p>@{username}</p>
                    </Wrapper>
                </Info>

                <Form onSubmit={onSubmit}>
                    {error?.length > 0 && currentRequest === "data" ? (
                        <ErrorMessage>
                            <strong>{error}</strong>
                        </ErrorMessage>
                    ) : null}

                    <InputsWrapper>
                        <InputWrapper>
                            <Label>Name</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} />
                        </InputWrapper>
                        <InputWrapper>
                            <Label>Username</Label>
                            <Input value={username} onChange={e => setUsername(e.target.value)} />
                        </InputWrapper>
                    </InputsWrapper>

                    <div className="buttons-wrapper">
                        <Button
                            className="cancel"
                            type="button"
                            onClick={() => resentInputs()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                        >
                            {loadingRequest && currentRequest === "data" ? (
                                <img
                                    src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`}
                                    alt="loading"
                                />
                            ) : "Update"}
                        </Button>
                    </div>
                </Form>

                <Form>
                    <InputWrapper>
                        <Label>
                            E-mail

                            {showEmail ? (
                                <VisibilityIcon onClick={() => setShowEmail(false)} />
                            ) : (
                                <VisibilityOffIcon onClick={() => setShowEmail(true)} />
                            )}
                        </Label>
                        <InputContainer>
                            <div onClick={() => setShowMessage(true)}>
                                <Input
                                    value={showEmail ? user?.email : `**************@${user?.email?.split("@")[1]}`}
                                    onChange={() => { }}
                                    disabled
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={() => setUpdateEmailScreen(true)}
                            >
                                Change
                            </Button>

                            {showMessage ? (
                                <Message>Click here to update</Message>
                            ) : null}
                        </InputContainer>
                    </InputWrapper>
                </Form>

                <Button
                    type="button"
                    className="password"
                    onClick={() => changePassword()}
                >
                    Change password
                </Button>

                <Button
                    type="button"
                    className="delete"
                    onClick={() => setDeleteAccountScreen(true)}
                >
                    Delete account
                </Button>
            </Inner>

            {updateEmailScreen ? (
                <WrapperScreen>
                    <Screen>
                        <Close
                            type="button"
                            onClick={() => closeScreen()}
                        >
                            <CloseIcon />
                        </Close>

                        <Form onSubmit={changeEmail}>
                            <h1>Write an e-mail</h1>

                            {error?.length > 0 && currentRequest === "email" ? (
                                <ErrorMessage>
                                    <strong>{error}</strong>
                                </ErrorMessage>
                            ) : null}

                            <InputWrapper>
                                <Label>New e-mail</Label>
                                <Input value={email} onChange={e => setEmail(e.target.value)} />
                            </InputWrapper>

                            <InputWrapper>
                                <Label>Password</Label>
                                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </InputWrapper>

                            <div className="button-wrapper">
                                <Button className="cancel" type="button" onClick={() => closeScreen()}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {loadingRequest && currentRequest === "email" ? (
                                        <img
                                            src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`}
                                            alt="loading"
                                        />
                                    ) : "Update"}
                                </Button>
                            </div>
                        </Form>
                    </Screen>

                    <Fill onClick={() => closeScreen()} />
                </WrapperScreen>
            ) : null}

            {deleteAccountScreen ? (
                <WrapperScreen>
                    <Screen className="delete">
                        <Close
                            type="button"
                            onClick={() => closeScreen()}
                        >
                            <CloseIcon />
                        </Close>

                        <Form onSubmit={deleteAccount}>
                            <h1>Are you sure?</h1>

                            <InputWrapper>
                                <Label>Password</Label>
                                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </InputWrapper>

                            <div className="button-wrapper">
                                <Button type="button" className="cancel" onClick={() => closeScreen()}>Cancel</Button>
                                <Button type="submit">
                                    {loadingRequest && currentRequest === "delete" ? (
                                        <img
                                            src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`}
                                            alt="loading"
                                        />
                                    ) : "Delete"}
                                </Button>
                            </div>
                        </Form>
                    </Screen>

                    <Fill onClick={() => closeScreen()} />
                </WrapperScreen>
            ) : null}

            <Warning showWarning={warning?.length > 0}>
                {warning}
            </Warning>
        </Container>
    );
};
