import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { groupService } from '../../../services'
import * as Actions from '../../../store/actions'
import { Contact, Group } from '../../../types/user'

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
    const { room, roomType } = useSelector(({ room }: any) => ({ room: room.current, roomType: room.type }))
    const dispatch = useDispatch()

    useEffect(() => {
        if (roomType === 'group' && !room?.users.length) {
            groupService.getUsers(room.id).then(users => dispatch(Actions.user.pushGroupUser(room.id, users)))
        }
    }, [room])

    return (
        <Container>
            <Header>
                <IconButton onClick={() => dispatch(Actions.room.toggleShowInfo())}>
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
                        {room.role === 'admim' ? (
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
