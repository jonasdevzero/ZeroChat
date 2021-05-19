import { useState, useEffect, useRef } from "react";
import { socket, messagesService } from "../../services";
import { UserI } from "../../types/user";
import { useSelector, useDispatch } from 'react-redux'
import * as UserActions from '../../store/actions/user'

import { Header, Messages, Form, Info } from './components'
import {
    Container,
    Inner,
    MessagesContainer,
    ScrollToBottom,
    LoadingMessages,
    ContainerWithoutChat
} from "../../styles/components/Room";
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@material-ui/icons";

interface MessagesI {
    theme: 'light' | 'dark';
};

export default function Room({ theme }: MessagesI) {
    const user: UserI = useSelector((state: any) => state.user)

    const messagesContainerRef = useRef(null)
    const [loadingMessages, setLoadingMessages] = useState(false)

    const [showScrollButton, setShowScrollButton] = useState(false)
    const [showRoomDetail, setShowRoomDetail] = useState(false)

    const { room, type: roomType } = useSelector((state: any) => state.currentRoom)
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
    }, [room, roomType]);

    useEffect(() => {
        socket.removeListener('message')
        socket.on('message', action => dispatch({ ...action, currentRoom: room?.id }))
    }, [room, user])

    useEffect(() => scrollToBottom(true), [room?.messages?.length])

    function onScroll() {
        if (messagesContainerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messagesContainerRef.current;
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
        <Container>
            {room ? (
                <>
                    <Inner>
                        <Header setShowRoomDetail={setShowRoomDetail} />

                        <MessagesContainer ref={messagesContainerRef} onScroll={() => onScroll()}>
                            {loadingMessages ? (
                                <LoadingMessages>
                                    <img src={`/loading-${theme === 'dark' ? 'light' : 'dark'}.svg`} alt="loading" />
                                </LoadingMessages>
                            ) : null}

                            <Messages messages={room.messages} />

                            {showScrollButton ? (
                                <ScrollToBottom onClick={() => scrollToBottom()}>
                                    <KeyboardArrowDownIcon fontSize="large" />
                                </ScrollToBottom>
                            ) : null}
                        </MessagesContainer>

                        <Form />
                    </Inner>

                    {showRoomDetail ? (<Info setShowRoomDetail={setShowRoomDetail} />) : null}
                </>
            ) : (
                <ContainerWithoutChat>
                    <h1>Select a room to chat</h1>
                </ContainerWithoutChat>
            )}
        </Container>
    );
};
