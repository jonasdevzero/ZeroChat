import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { roomUtil } from '../../../utils'
import moment from 'moment'
import { messagesService } from '../../../services'
import * as UserActions from '../../../store/actions/user'
import { useTheme } from '../../../hooks'

import {
    Container,
    LoadingMessages,
    ScrollToBottom,
    Message,
    Inner,
    Text,
    Time,
    Day,
    User,
    Username
} from '../../../styles/components/Room/components/Messages'
import { Avatar } from "@material-ui/core"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"

function Messages() {
    const { room, roomType } = useSelector(({ room }: any) => ({ room: room.current, roomType: room.type }))
    const userId = useSelector((state: any) => state.user.id)
    const [theme] = useTheme()

    const messagesContainerRef = useRef(null)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [showScrollButton, setShowScrollButton] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (room) {
            if (!room.messages.length) {
                setLoadingMessages(true);

                messagesService.get({ roomId: room.id, roomType })
                    .then(messages => dispatch(UserActions.updateRoom({ where: room.id, set: { messages }, roomType })))
                    .then(() => scrollToBottom())
                    .then(() => setLoadingMessages(false))
            }

            room.unread_messages > 0 ? messagesService.viewed({ roomId: room.id, roomType })
                .then(() => dispatch(UserActions.updateRoom({ where: room.id, set: { unread_messages: undefined }, roomType })))
                : null

            scrollToBottom()
        }
    }, [room, roomType])

    useEffect(() => scrollToBottom(true), [room?.messages?.length])

    function onScroll() {
        if (messagesContainerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messagesContainerRef.current
            setShowScrollButton(!(scrollTop + 100 > scrollHeight - clientHeight))

            // if the user scroll all to top, load more messages if exists...
        }
    }

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
            }
        }
    }

    return (
        <Container ref={messagesContainerRef} onScroll={() => onScroll()}>
            {loadingMessages ? (
                <LoadingMessages>
                    <img src={`/loading-${theme === 'dark' ? 'light' : 'dark'}.svg`} alt="loading" />
                </LoadingMessages>
            ) : null}

            {roomUtil.orderMessages(room.messages).map((msg, i, arr) => {
                if (msg.type && msg.type === "day") {
                    return <Day key={i}>{msg.date}</Day>
                };

                return (
                    <Message key={i} className={msg?.sender_id === arr[i - 1]?.sender_id && "concat"}>
                        {roomType === 'group' && msg?.sender_id !== userId && msg?.sender_id !== arr[i - 1]?.sender_id ? (
                            <User>
                                <Avatar src={msg.sender.image} />
                                <Username>{msg.sender.username}</Username>
                            </User>
                        ) : null}

                        <Inner className={msg?.sender_id === userId && "sender"}>
                            <Text>{msg.text}</Text>
                            <Time>{moment(msg.created_at).format("HH:mm A")}</Time>
                        </Inner>
                    </Message>
                )
            })}

            {showScrollButton ? (
                <ScrollToBottom onClick={() => scrollToBottom()}>
                    <KeyboardArrowDownIcon fontSize="large" />
                </ScrollToBottom>
            ) : null}
        </Container>
    )
}

export default Messages
