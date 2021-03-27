import { useState, useEffect } from "react";
import api from "../services/api";
import { UserI, ContactI, GroupI } from "../types/user";
import moment from "moment";

import { Details } from "../components";
import {
    Container,
    Inner,
    Header,
    Room,
    MessagesContainer,
    MessageWrapper,
    MessageInner,
    Message,
    Day,
    Time,
    FormContainer,
    Form,
    Input,
    Submit,
    IconButton,
    ScrollToBottom,
    EmojiPickerContainer,
} from "../styles/components/Messages";
import { Avatar, IconButton as IconButtonUi } from "@material-ui/core";
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

interface MessagesI {
    user: UserI;
    socket: SocketIOClient.Socket;
    currentRoom: ContactI & GroupI;
    currentRoomType: "contact" | "group";
    messagesContainerRef: React.MutableRefObject<any>;
    scrollToBottom(newMessage?: boolean): void;
};

export default function Messages({ user, socket, currentRoom, currentRoomType, messagesContainerRef, scrollToBottom }: MessagesI) {
    const [message, setMessage] = useState("");

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showRoomDetail, setShowRoomDetail] = useState(false);

    useEffect(() => setShowRoomDetail(false), [currentRoom]);

    async function handleMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (message.trim()) {
            const tag = currentRoomType === "contact" ? "private" : "group";
            const data = { message, receiver_id: currentRoom.id, group_id: currentRoom.id };

            setShowEmojiPicker(false);

            await api.post(`/${currentRoomType}/message`, data).then(response => {
                const { message } = response.data;
                socket.emit(`${tag}-message`, message, () => setMessage(""));
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
        <Container>
            <Inner>
                <Header>
                    <Room onClick={() => setShowRoomDetail(true)}>
                        <Avatar src={currentRoom?.image} />
                        <h2>{currentRoom?.username ? currentRoom?.username : currentRoom?.name}</h2>
                    </Room>

                    {currentRoomType === "contact" ? (
                        <>
                            <IconButtonUi>
                                <CallIcon />
                            </IconButtonUi>

                            <IconButtonUi>
                                <VideocamIcon />
                            </IconButtonUi>
                        </>
                    ) : null}

                    <IconButtonUi>
                        <MoreVertIcon />
                    </IconButtonUi>
                </Header>

                <MessagesContainer ref={messagesContainerRef} onScroll={() => onScroll()}>
                    {currentRoom?.messages?.map((msg, i) => {
                        if (msg.type && msg.type === "day") {
                            return <Day key={i}>{msg.date}</Day>
                        };

                        return (
                            <MessageWrapper key={i} className={msg.sender_id === currentRoom.messages[i - 1].sender_id && "concat"}>
                                <MessageInner className={msg.sender_id === user.id && "sender"}>
                                    <Message>
                                        {msg.message}
                                    </Message>

                                    <Time>{moment(msg.posted_at).format("HH:mm A")}</Time>
                                </MessageInner>
                            </MessageWrapper>
                        );
                    })}

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

                    <IconButton type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <InsertEmoticonIcon fontSize="large" />
                    </IconButton>

                    <Form onSubmit={handleMessage}>
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
            </Inner>

            {showRoomDetail ? (
                <Details
                    currentRoom={currentRoom}
                    currentRoomType={currentRoomType}
                    setShowRoomDetail={setShowRoomDetail}
                />
            ) : null}
        </Container>
    );
};
