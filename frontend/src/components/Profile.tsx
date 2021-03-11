import { useState } from "react";
import { UserI } from "../types/user";

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

} from "../styles/components/Container";
import Warning from "./Warning";
import { Avatar } from "@material-ui/core";
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Close as CloseIcon,
} from '@material-ui/icons';

interface ProfileI {
    user: UserI;
};

export default function Profile({ user }: ProfileI) {
    const [name, setName] = useState(user?.name);
    const [username, setUsername] = useState(user?.username);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showEmail, setShowEmail] = useState(false);
    const [updateEmailScreen, setUpdateEmailScreen] = useState(false);

    const [showMessage, setShowMessage] = useState(false);

    const [deleteAccountScreen, setDeleteAccountScreen] = useState(false);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        //...
    };

    function changeEmail(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        //...
    };

    function changePassword() {
        //...
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

    function closeNewEmailScreen() {
        setUpdateEmailScreen(false);
        setEmail("");
        setPassword("");
    };

    function closeDeleteAccountScreen() {
        setDeleteAccountScreen(false);
        setPassword("");
    };

    return (
        <Container>
            <Header>
                <h1>Profile</h1>
            </Header>

            <Inner>
                <Info>
                    <Avatar className="profile-picture" src={user?.picture} />

                    <div>
                        <h3>{user?.name}</h3>
                        <p>@{user?.username}</p>
                    </div>
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
                                    value={showEmail ? user?.email : `**************@${user?.email.split("@")[1]}`}
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
                            onClick={() => closeNewEmailScreen()}
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

                    <Fill
                        onClick={() => closeNewEmailScreen()}
                    />
                </WrapperScreen>
            ) : null}

            {deleteAccountScreen ? (
                <WrapperScreen>
                    <Screen className="delete">
                        <Close
                            type="button"
                            onClick={() => closeDeleteAccountScreen()}
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

                    <Fill
                        onClick={() => closeDeleteAccountScreen()}
                    />
                </WrapperScreen>
            ) : null}
        </Container>
    );
};
