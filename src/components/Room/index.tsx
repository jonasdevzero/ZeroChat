import { useState, useEffect } from "react"
import { socket } from "../../services"
import { UserI } from "../../types/user"
import { useSelector, useDispatch } from 'react-redux'

import { Header, Messages, Form, Info } from './components'
import { Container, Inner, ContainerWithoutChat } from "../../styles/components/Room"


export default function Room() {
    const user: UserI = useSelector((state: any) => state.user)
    const room = useSelector(({ room }: any) => room.current)

    const [showRoomDetail, setShowRoomDetail] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        socket.removeListener('message')
        socket.on('message', action => dispatch({ ...action, currentRoom: room?.id }))
    }, [room, user])

    return (
        <Container>
            {room ? (
                <>
                    <Inner>
                        <Header setShowRoomDetail={setShowRoomDetail} />
                        <Messages />
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
