import { useState, useEffect, useRef } from "react";
import { api, socket } from "../services";
import { UserI } from "../types/user";
import { SetUserMasterI } from "../types/useSetUserMaster";
import moment from "moment";
import { orderMessages } from "../utils";
import { useDispatch, useSelector } from 'react-redux'
import { callStart } from '../store/actions/call'

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
    LoadingMessages,
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
    setUserMaster: SetUserMasterI;
    theme: 'light' | 'dark';
};

export default function Messages({ user, setUserMaster, theme }: MessagesI) {
    const [message, setMessage] = useState("");

    const messagesContainerRef = useRef(null);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showRoomDetail, setShowRoomDetail] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const dispatch = useDispatch()
    const { room: currentRoom, type: currentRoomType } = useSelector((state: any) => state.currentRoom)

    useEffect(() => {
        const updateTag = currentRoomType === "contact" ? "contacts" : "groups";

        if (!currentRoom.messages.length) {
            setLoadingMessages(true);

            api.get(`/${currentRoomType}/messages/${currentRoom.id}`).then(response => {
                const { messages } = response.data;
                setUserMaster[updateTag].update({ where: currentRoom.id, set: { messages } }).then(() => {
                    scrollToBottom();
                    setLoadingMessages(false);
                });
            });
        };

        if (currentRoom.unread_messages > 0) {
            api.put(`/${currentRoomType}/${currentRoom.id}?action=unread_messages`).then(() => {
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
            setShowScrollButton(!(scrollTop + 100 > scrollHeight - clientHeight))

            // if the user scroll all to top, load more messages if exists...
        };
    };

    async function handleMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (message.trim()) {
            setShowEmojiPicker(false);
            const message_type = currentRoomType === "contact" ? "private" : "group";
            await api.post(`/${currentRoomType}/messages`, { text: message, to: currentRoom.id })
                .then(({ data }) => socket.emit(`${message_type}-message`, data, () => setMessage("")));
        };
    };

    return (
        <Container>
            <Inner>
                <Header>
                    <Room onClick={() => setShowRoomDetail(true)}>
                        <Avatar src={currentRoom.picture} />

                        <h2>{currentRoom?.username ? currentRoom?.username : currentRoom?.name}</h2>
                    </Room>

                    {currentRoomType === "contact" ? (
                        <>
                            <IconButton onClick={() => dispatch(callStart(currentRoom, 'audio'))}>
                                <CallIcon />
                            </IconButton>

                            <IconButton onClick={() => dispatch(callStart(currentRoom, 'video'))}>
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
                    {loadingMessages ? (
                        <LoadingMessages>
                            <img src={`/loading-${theme === 'dark' ? 'light' : 'dark'}.svg`} alt="loading"/>
                        </LoadingMessages>
                    ) : null}

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
                                        {msg.text}
                                    </Message.Text>

                                    <Message.Time>
                                        {moment(msg.created_at).format("HH:mm A")}
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
