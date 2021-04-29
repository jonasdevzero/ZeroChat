import { Dispatch, SetStateAction } from "react";
import { ContactI, GroupI, UserI } from "../types/user";

import {
    Container,
    Header,
    Inner,
    GroupDescription,
    GroupUsers,
    EditGroupContainer,
} from "../styles/components/RoomInfo";
import { IconButton, Avatar } from "@material-ui/core"
import {
    Close as CloseIcon,
    Edit as EditIcon,
} from '@material-ui/icons';

interface DetailsI {
    user: UserI;
    currentRoom: ContactI & GroupI;
    currentRoomType: "contact" | "group";
    setShowRoomDetail: Dispatch<SetStateAction<boolean>>;
};

export default function RoomInfo({ user, currentRoom, currentRoomType, setShowRoomDetail }: DetailsI) {


    return (
        <Container>
            <Header>
                <IconButton onClick={() => setShowRoomDetail(false)}>
                    <CloseIcon fontSize="large" />
                </IconButton>
            </Header>

            <Inner>
                <Avatar src={currentRoom.image} />
                <h4>{currentRoomType === "contact" ? currentRoom.username : currentRoom.name}</h4>

                {currentRoomType === "contact" ? (
                    <>

                    </>
                ) : (
                    <>
                        {currentRoom.users.find(u => u.id === user.id).role === 'admim' ? (
                            <EditGroupContainer>
                                <IconButton>
                                    <EditIcon fontSize="large" />
                                </IconButton>
                            </EditGroupContainer>
                        ) : null}

                        <GroupDescription>
                            <h4>Description</h4>

                            <p>{currentRoom.description}</p>
                        </GroupDescription>

                        <GroupUsers>
                            <h4>Members</h4>

                            {currentRoom.users.map((u, i) => {
                                return (
                                    <GroupUsers.User key={i}>
                                        <Avatar src={u.image} />
                                        <h5>{u.username}</h5>

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
