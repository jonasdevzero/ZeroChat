import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { UserI } from "../types/user";
import { api, socket } from "../services";
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
} from "../styles/components/BaseContainer";
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
};

export default function Profile({ user, setUserMaster, theme, setToken }: ProfileI) {
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
                    <Form.Wrapper.Image>
                        {!picture ? (
                            <>
                                <Form.Image.Label htmlFor="image">
                                    <CloudUploadIcon fontSize="large" />
                                </Form.Image.Label>

                                <Form.ImageInput
                                    id="image"
                                    type="file"
                                    onChange={handleSelectImage}
                                />
                            </>
                        ) : (
                            <Form.Image.Remove type="button" onClick={() => removeSelectedImage()}>
                                <CloseIcon fontSize="large" />
                            </Form.Image.Remove>
                        )}

                        <Avatar src={picture} />
                    </Form.Wrapper.Image>

                    <Form.Wrapper>
                        <h3>{name}</h3>
                        <p>@{username}</p>
                    </Form.Wrapper>
                </Info>

                <Form onSubmit={onSubmit}>
                    {error?.length > 0 && currentRequest === "data" ? (
                        <Form.Error>
                            <Form.Error.Message>
                                {error}
                            </Form.Error.Message>
                        </Form.Error>
                    ) : null}

                    <InputsWrapper>
                        <Form.Wrapper.Input>
                            <Form.Label>
                                Name
                            </Form.Label>

                            <Form.Input value={name} onChange={e => setName(e.target.value)} />
                        </Form.Wrapper.Input>

                        <Form.Wrapper.Input>
                            <Form.Label>
                                Username
                            </Form.Label>

                            <Form.Input value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Wrapper.Input>
                    </InputsWrapper>

                    <Form.Wrapper.Button className="right">
                        <Form.Button className="cancel" type="button" onClick={() => resentInputs()}>
                            Cancel
                        </Form.Button>

                        <Form.Button type="submit">
                            {loadingRequest && currentRequest === "data" ? (
                                <img
                                    src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`}
                                    alt="loading"
                                />
                            ) : "Update"}
                        </Form.Button>
                    </Form.Wrapper.Button>
                </Form>

                <Form>
                    <Form.Wrapper.Input>
                        <Form.Label>
                            E-mail

                            {showEmail ? (
                                <VisibilityIcon onClick={() => setShowEmail(false)} />
                            ) : (
                                <VisibilityOffIcon onClick={() => setShowEmail(true)} />
                            )}
                        </Form.Label>

                        <InputContainer>
                            <div onClick={() => setShowMessage(true)}>
                                <Form.Input
                                    value={showEmail ? user?.email : `**************@${user?.email?.split("@")[1]}`}
                                    onChange={() => { }}
                                    disabled
                                />
                            </div>

                            <Form.Button type="button" onClick={() => setUpdateEmailScreen(true)}>
                                Change
                            </Form.Button>

                            {showMessage ? (<Message>Click here to update</Message>) : null}
                        </InputContainer>
                    </Form.Wrapper.Input>
                </Form>

                <Form.Button type="button" className="password" onClick={() => changePassword()}>
                    Change password
                </Form.Button>

                <Form.Button type="button" className="delete" onClick={() => setDeleteAccountScreen(true)}>
                    Delete account
                </Form.Button>
            </Inner>

            {updateEmailScreen ? (
                <WrapperScreen>
                    <Screen>
                        <Close type="button" onClick={() => closeScreen()}>
                            <CloseIcon />
                        </Close>

                        <Form onSubmit={changeEmail}>
                            <h1>Write an e-mail</h1>

                            {error?.length > 0 && currentRequest === "email" ? (
                                <Form.Error>
                                    <strong>{error}</strong>
                                </Form.Error>
                            ) : null}

                            <Form.Wrapper.Input>
                                <Form.Label>
                                    New e-mail
                                </Form.Label>

                                <Form.Input value={email} onChange={e => setEmail(e.target.value)} />
                            </Form.Wrapper.Input>

                            <Form.Wrapper.Input>
                                <Form.Label>
                                    Password
                                </Form.Label>

                                <Form.Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </Form.Wrapper.Input>

                            <Form.Wrapper.Button>
                                <Form.Button className="cancel" type="button" onClick={() => closeScreen()}>
                                    Cancel
                                </Form.Button>

                                <Form.Button type="submit">
                                    {loadingRequest && currentRequest === "email" ? (
                                        <img
                                            src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`}
                                            alt="loading"
                                        />
                                    ) : "Update"}
                                </Form.Button>
                            </Form.Wrapper.Button>
                        </Form>
                    </Screen>

                    <Fill onClick={() => closeScreen()} />
                </WrapperScreen>
            ) : null}

            {deleteAccountScreen ? (
                <WrapperScreen>
                    <Screen className="delete">
                        <Close type="button" onClick={() => closeScreen()}>
                            <CloseIcon />
                        </Close>

                        <Form onSubmit={deleteAccount}>
                            <h1>Are you sure?</h1>

                            <Form.Wrapper.Input>
                                <Form.Label>
                                    Password
                                </Form.Label>

                                <Form.Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </Form.Wrapper.Input>

                            <div className="button-wrapper">
                                <Form.Button type="button" className="cancel" onClick={() => closeScreen()}>
                                    Cancel
                                </Form.Button>

                                <Form.Button type="submit">
                                    {loadingRequest && currentRequest === "delete" ? (
                                        <img
                                            src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`}
                                            alt="loading"
                                        />
                                    ) : "Delete"}
                                </Form.Button>
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
