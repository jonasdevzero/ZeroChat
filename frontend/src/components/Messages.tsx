import { useState, useEffect, useRef } from "react";
import { api, socket } from "../services";
import { UserI, ContactI, GroupI } from "../types/user";
import { SetUserMasterI } from "../types/useSetUserMaster";
import moment from "moment";
import { orderMessages } from "../utils";

import { RoomInfo } from "../components";
import {
    Container,
    Inner,
    Header,
    Room,
    MessagesContainer,
    Message,
    Form,
    ScrollToBottom,
} from "../styles/components/Messages";
import Dropdown from '../styles/components/Dropdown';
import { Avatar, IconButton } from "@material-ui/core";
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
    currentRoom: ContactI & GroupI;
    currentRoomType: "contact" | "group";
    setUserMaster: SetUserMasterI;
    callUser(contact: ContactI): void;
};

export default function Messages({ user, currentRoom, currentRoomType, setUserMaster, callUser }: MessagesI) {
    const [message, setMessage] = useState("");

    const messagesContainerRef = useRef(null);

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showRoomDetail, setShowRoomDetail] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const updateTag = currentRoomType === "contact" ? "contacts" : "groups";

        if (!(currentRoom?.messages)) {
            api.get(`/${currentRoomType}/messages?${currentRoomType}_id=${currentRoom.id}`).then(response => {
                const { messages } = response.data;
                setUserMaster[updateTag].update({ where: currentRoom.id, set: { messages } }).then(() => scrollToBottom());
            });
        };

        if (currentRoom.unread_messages > 0) {
            api.put(`/${currentRoomType}/${currentRoom.id}?unread_messages=true`).then(() => {
                setUserMaster[updateTag].update({ where: currentRoom.id, set: { unread_messages: 0 } });
            });
        };

        scrollToBottom();
    }, [currentRoom]);

    useEffect(() => scrollToBottom(true), [currentRoom?.messages?.length]);

    function scrollToBottom(newMessage?: boolean) {
        if (messagesContainerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messagesContainerRef.current;
            const scroll = scrollHeight - clientHeight;

            if (newMessage) {
                if (scrollTop + 200 > scrollHeight - clientHeight) {
                    messagesContainerRef.current.scrollTo(0, scroll);
                };
            } else {
                messagesContainerRef.current.scrollTo(0, scroll);
            };
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

            // if the user scroll all to top, load more messages if exists
            // ...
        };
    };

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
                            <IconButton onClick={() => callUser(currentRoom)}>
                                <CallIcon />
                            </IconButton>

                            <IconButton>
                                <VideocamIcon />
                            </IconButton>
                        </>
                    ) : null}

                    <Dropdown.Wrapper>
                        <IconButton onClick={() => setShowDropdown(!showDropdown)}>
                            <MoreVertIcon />
                        </IconButton>

                        {showDropdown ? (
                            <Dropdown>
                                <Dropdown.Item onClick={() => { }}>
                                    {currentRoomType} info
                                </Dropdown.Item>

                                <Dropdown.Item onClick={() => { }}>
                                    Leave Group
                                </Dropdown.Item>
                            </Dropdown>
                        ) : null}
                    </Dropdown.Wrapper>
                </Header>

                <MessagesContainer ref={messagesContainerRef} onScroll={() => onScroll()}>
                    {orderMessages(currentRoom?.messages).map((msg, i, arr) => {
                        if (msg.type && msg.type === "day") {
                            return <Message.Day key={i}>{msg.date}</Message.Day>
                        };

                        return (
                            <Message key={i} className={msg?.sender_id === arr[i - 1]?.sender_id && "concat"}>
                                {currentRoomType === 'group' && msg?.sender_id !== user.id && msg?.sender_id !== arr[i - 1]?.sender_id ? (
                                    <Message.User>
                                        <Avatar src={msg.sender.image} />

                                        <Message.User.Username>
                                            {msg.sender.username}
                                        </Message.User.Username>
                                    </Message.User>
                                ) : null}

                                <Message.Inner className={msg?.sender_id === user.id && "sender"}>
                                    <Message.Text>
                                        {msg.message}
                                    </Message.Text>

                                    <Message.Time>
                                        {moment(msg.posted_at).format("HH:mm A")}
                                    </Message.Time>
                                </Message.Inner>
                            </Message>
                        );
                    })}

                    {showScrollButton ? (
                        <ScrollToBottom onClick={() => scrollToBottom()}>
                            <KeyboardArrowDownIcon fontSize="large" />
                        </ScrollToBottom>
                    ) : null}
                </MessagesContainer>

                <Form onSubmit={handleMessage}>
                    {showEmojiPicker ? (
                        <Form.EmojiPickerContainer>
                            <Picker onSelect={(emoji: BaseEmoji) => setMessage(message.concat(emoji.native))} />
                        </Form.EmojiPickerContainer>
                    ) : null}

                    <Form.IconButton type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <InsertEmoticonIcon fontSize="large" />
                    </Form.IconButton>

                    <Form.Inner>
                        <Form.Input
                            type="text"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            autoComplete="off"
                            onFocus={() => setShowEmojiPicker(false)}
                        />

                        <Form.Submit type="submit">
                            <SendIcon fontSize="large" />
                        </Form.Submit>
                    </Form.Inner>
                </Form>
            </Inner>

            {showRoomDetail ? (
                <RoomInfo
                    user={user}
                    currentRoom={currentRoom}
                    currentRoomType={currentRoomType}
                    setShowRoomDetail={setShowRoomDetail}
                />
            ) : null}
        </Container>
    );
};
