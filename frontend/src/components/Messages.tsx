import { useState } from "react";
import api from "../services/api";

import {
    Header,
    Room,
    MessagesContainer,
    Message,
    MessageSender,
    FormContainer,
    Form,
    Input,
    Submit,
    IconButton,
    ScrollToBottom,
    EmojiPickerContainer,
} from "../styles/components/Messages";
import { Avatar, IconButton as IButton } from "@material-ui/core";
import {
    Send as SendIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    InsertEmoticon as InsertEmoticonIcon,
    MoreVert as MoreVertIcon,
    Call as CallIcon,
    Videocam as VideocamIcon,
} from "@material-ui/icons";

import "emoji-mart/css/emoji-mart.css";
import { Picker, BaseEmoji } from "emoji-mart";
import { UserI, ContactI, GroupI } from "../types/user";

interface MessagesI {
    user: UserI;
    socket: SocketIOClient.Socket
    currentContact: ContactI;
    currentGroup: GroupI;
    currentContainer: "profile" | "contacts" | "groups" | "addContact" | "createGroup";
    messagesContainerRef: React.MutableRefObject<any>;
    scrollToBottom(newMessage?: boolean): void
};

export default function Messages({ user, socket, currentContact, currentGroup, currentContainer, messagesContainerRef, scrollToBottom }: MessagesI) {
    const [message, setMessage] = useState("");

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    async function privateMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setShowEmojiPicker(false);
        const receiver_id = currentContact?.id, id_contact = currentContact?.id_contact;

        if (message.trim()) {
            await api.post(`/contact/message`, { message, receiver_id, id_contact }).then(response => {
                const { message, unread_messages } = response.data;
                socket.emit("private-message", { message, unread_messages }, () => setMessage(""));
            });
        };
    };

    async function groupMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (message.trim()) {
            await api.post(`/group/message`, { group_id: currentGroup?.id, message }).then(response => {
                const { message } = response.data;
                socket.emit("group-message", { message }, () => setMessage(""));
            });
        };
    };

    function onScroll() {
        if (messagesContainerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messagesContainerRef.current;

            if (!(scrollTop + 100 > scrollHeight - clientHeight)) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            };
        };
    };

    return (
        <>
            <Header>
                <Room>
                    <Avatar src={currentContainer === "contacts" ? currentContact?.image : currentGroup?.image} />
                    <h2>{currentContainer === "contacts" ? currentContact?.username : currentGroup?.name}</h2>
                </Room>

                {currentContact ? (
                    <>
                        <IButton>
                            <CallIcon />
                        </IButton>

                        <IButton>
                            <VideocamIcon />
                        </IButton>

                    </>
                ) : null}

                <IButton>
                    <MoreVertIcon />
                </IButton>
            </Header>

            <MessagesContainer ref={messagesContainerRef} onScroll={() => onScroll()}>
                {currentContact ?
                    currentContact?.messages?.map((msg, i) => {
                        return msg ? msg.sender_id === user?.id ? (
                            <MessageSender key={i}>
                                {msg.message}
                            </MessageSender>
                        ) : (
                            <Message key={i}>
                                {msg.message}
                            </Message>
                        )
                            : null
                    })
                    :
                    currentGroup?.messages?.map((msg, i) => {
                        return msg ? msg.sender_id === user?.id ? (
                            <MessageSender key={i}>
                                {msg.message}
                            </MessageSender>
                        ) : (
                            <Message key={i}>
                                {msg.message}
                            </Message>
                        )
                            : null
                    })
                }

                {showScrollButton ? (
                    <ScrollToBottom onClick={() => scrollToBottom()}>
                        <KeyboardArrowDownIcon fontSize="large" />
                    </ScrollToBottom>
                ) : null}
            </MessagesContainer>

            <FormContainer>
                {showEmojiPicker ? (
                    <EmojiPickerContainer>
                        <Picker onSelect={(emoji: BaseEmoji) => setMessage(message.concat(emoji.native))} />
                    </EmojiPickerContainer>
                ) : null}

                <IconButton
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <InsertEmoticonIcon fontSize="large" />
                </IconButton>

                <Form onSubmit={currentContainer === "contacts" ? privateMessage : groupMessage}>
                    <Input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        autoComplete="off"
                        onFocus={() => setShowEmojiPicker(false)}
                    />

                    <Submit type="submit">
                        <SendIcon fontSize="large" />
                    </Submit>
                </Form>
            </FormContainer>
        </>
    );
};
