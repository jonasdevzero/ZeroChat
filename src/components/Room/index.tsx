import { useSelector } from 'react-redux'

import { Header, Messages, Form, Info } from './components'
import { Container, Inner, ContainerWithoutChat } from "../../styles/components/Room"

export default function Room() {
    const { room, showInfo } = useSelector(({ room }: any) => ({ room: room.current, showInfo: room.showInfo }))

    return (
        <Container>
            {room ? (
                <>
                    <Inner>
                        <Header />
                        <Messages />
                        <Form />
                    </Inner>

                    {showInfo && (<Info />)}
                </>
            ) : (
                <ContainerWithoutChat>
                    <img src="/logo-background.svg" />
                    <span>Select a room to chat</span>
                    <p>
                        No Have anyone to chat?
                        <button>Play a game</button>
                    </p>
                </ContainerWithoutChat>
            )}
        </Container>
    );
};
