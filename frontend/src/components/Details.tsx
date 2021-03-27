import { Dispatch, SetStateAction } from "react";
import { ContactI, GroupI } from "../types/user";

import {
    Container,
    Header,
    Inner,
    GroupDescription,
    GroupUsers,
} from "../styles/components/Details";
import { IconButton, Avatar } from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close';

interface DetailsI {
    currentRoom: ContactI & GroupI;
    currentRoomType: "contact" | "group";
    setShowRoomDetail: Dispatch<SetStateAction<boolean>>;
};

export default function Details({ currentRoom, currentRoomType, setShowRoomDetail }: DetailsI) {


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
                                            <GroupUsers.User.Admin>Admin</GroupUsers.User.Admin>
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
