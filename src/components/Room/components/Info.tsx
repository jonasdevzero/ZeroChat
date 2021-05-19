import { Dispatch, SetStateAction } from "react"
import { useSelector } from 'react-redux'

import {
    Container,
    Header,
    Inner,
    GroupDescription,
    GroupUsers,
    EditGroupContainer,
} from "../../../styles/components/Room/components/Info"
import { IconButton, Avatar } from "@material-ui/core"
import {
    Close as CloseIcon,
    Edit as EditIcon,
} from '@material-ui/icons';

interface DetailsI {
    setShowRoomDetail: Dispatch<SetStateAction<boolean>>
}

export default function Info({ setShowRoomDetail }: DetailsI) {
    const userId = useSelector((state: any) => state.user.id)
    const { room, type: roomType } = useSelector((state: any) => state.currentRoom)

    return (
        <Container>
            <Header>
                <IconButton onClick={() => setShowRoomDetail(false)}>
                    <CloseIcon fontSize="large" />
                </IconButton>
            </Header>

            <Inner>
                <Avatar src={room.picture} />
                <h4>{roomType === "contact" ? room.username : room.name}</h4>

                {roomType === "contact" ? (
                    <>
                        {/* Contact Options, ex: Block, Clear Messages... */}
                    </>
                ) : (
                    <>
                        {room.users.find(u => u.user.id === userId).role === 'admim' ? (
                            <EditGroupContainer>
                                <IconButton>
                                    <EditIcon fontSize="large" />
                                </IconButton>
                            </EditGroupContainer>
                        ) : null}

                        <GroupDescription>
                            <h4>Description</h4>
                            <p>{room.description}</p>
                        </GroupDescription>

                        <GroupUsers>
                            <h4>Members</h4>

                            {room.users.map((u, i) => {
                                return (
                                    <GroupUsers.User key={i}>
                                        <Avatar src={u.user.picture} />
                                        <h5>{u.user.username}</h5>

                                        {u.role === "admim" ? (
                                            <GroupUsers.User.Admin>Adm</GroupUsers.User.Admin>
                                        ) : null}
                                    </GroupUsers.User>
                                );
                            })}
                        </GroupUsers>
                    </>
                )}

            </Inner>
        </Container>
    );
};
