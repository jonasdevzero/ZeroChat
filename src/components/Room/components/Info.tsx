import { useSelector, useDispatch } from 'react-redux'
import * as RoomActions from '../../../store/actions/room'

import {
    Container,
    Header,
    Inner,
    GroupDescription,
    GroupUsers,
    EditGroupContainer,
} from "../../../styles/components/Room/Info"
import { IconButton, Avatar } from "@material-ui/core"
import {
    Close as CloseIcon,
    Edit as EditIcon,
} from '@material-ui/icons';

export default function Info() {
    const userId = useSelector((state: any) => state.user.id)
    const { room, roomType } = useSelector(({ room }: any) => ({ room: room.current, roomType: room.type }))
    const dispatch = useDispatch()

    return (
        <Container>
            <Header>
                <IconButton onClick={() => dispatch(RoomActions.toggleShowInfo())}>
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
