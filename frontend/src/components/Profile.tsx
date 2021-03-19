import { useState } from "react";
import { UserI } from "../types/user";
import api from "../services/api";

import {
    Info,
    Form,
    InputWrapper,
    Label,
    Input,
    InputContainer,
    Button,
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
    Wrapper,
    ImageWrapper,
    ImageLabel,
    ImageInput,
    RemoveImage,
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
    setUser: React.Dispatch<React.SetStateAction<UserI>>;
};

export default function Profile({ user, setUser }: ProfileI) {
    const [name, setName] = useState(user?.name);
    const [username, setUsername] = useState(user?.username);
    const [picture, setPicture] = useState(user?.picture);
    const [newPicture, setNewPicture] = useState<File>(undefined);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showEmail, setShowEmail] = useState(false);
    const [updateEmailScreen, setUpdateEmailScreen] = useState(false);

    const [showMessage, setShowMessage] = useState(false);

    const [deleteAccountScreen, setDeleteAccountScreen] = useState(false);

    const [warning, setWarning] = useState("");
    const [showWarning, setShowWarning] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData();
        data.append("name", name);
        data.append("username", username);
        data.append("picture", newPicture);

        await api.put(`/user/${user?.id}?without_image=${picture?.length === 0}`, data).then(response => {
            const { user: { name, username, picture } } = response.data;

            setUser({
                ...user,
                name,
                username,
                picture,
            });

            setWarning("Updated with success!");
            setShowWarning(true);
            setTimeout(() => { setShowWarning(false) }, 2000);
        });
    };

    async function changeEmail(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await api.put(`user/${user?.id}`, { email, password })
    };

    async function changePassword() {
        await api.post("user/forgot_password", { email }).then(response => {
            setWarning(response.data.message);
            setShowWarning(true);
            setTimeout(() => { setShowWarning(false) }, 2000);
        });
    };

    function deleteAccount(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        //...
    };

    function animateMessage() {
        setShowMessage(true);

        setTimeout(() => {
            setShowMessage(false);
        }, 3000);
    };

    function closeScreen() {
        setUpdateEmailScreen(false);
        setDeleteAccountScreen(false);
        setEmail("");
        setPassword("");
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
                    <InputWrapper>
                        <Label>Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} />
                    </InputWrapper>
                    <InputWrapper>
                        <Label>Username</Label>
                        <Input value={username} onChange={e => setUsername(e.target.value)} />
                    </InputWrapper>

                    <Button>Update</Button>
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
                            <div onClick={() => animateMessage()}>
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

                            <InputWrapper>
                                <Label>New e-mail</Label>
                                <Input value={email} onChange={e => setEmail(e.target.value)} />
                            </InputWrapper>

                            <InputWrapper>
                                <Label>Password</Label>
                                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </InputWrapper>

                            <Button type="submit">Update</Button>
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

                            <Button type="submit">Delete</Button>
                        </Form>
                    </Screen>

                    <Fill onClick={() => closeScreen()} />
                </WrapperScreen>
            ) : null}

            <Warning showWarning={showWarning}>
                {warning}
            </Warning>
        </Container>
    );
};
