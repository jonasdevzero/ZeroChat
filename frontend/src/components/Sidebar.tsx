import { UserI, ContactI, GroupI } from "../types/user";

import {
    Container,
    Header,
    RoomsContainer,
    Room,
    SelectChatType,
    Status,
    ChatTypeButton
} from "../styles/components/Sidebar";
import { Avatar } from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';

interface SidebarI {
    user: UserI;

    currentRoomType: "contacts" | "groups";
    setCurrentRoomType: React.Dispatch<React.SetStateAction<"contacts" | "groups">>

    setCurrentContact: React.Dispatch<React.SetStateAction<ContactI>>;
    setCurrentGroup: React.Dispatch<React.SetStateAction<GroupI>>;
};

function Sidebar({ user, setCurrentContact, setCurrentGroup, currentRoomType, setCurrentRoomType }: SidebarI) {
    return (
        <Container>
            <Header>
                <Avatar src={user?.picture} />
                <h2>{user?.username}</h2>
            </Header>

            <RoomsContainer>
                {currentRoomType === "contacts" ? (
                    user?.contacts?.map((contact, i) => {
                        return (
                            <Room key={i} onClick={() => setCurrentContact(contact)}>
                                <Avatar src={contact.image} />
                                <h3>{contact.username}</h3>
                                <Status className={contact.online ? "online" : "offline"} />
                            </Room>
                        );
                    })
                ) : (
                        user?.groups?.map((group, i) => {
                            return (
                                <Room key={i} onClick={() => setCurrentGroup(group)}>
                                    <Avatar src={group.image} />
                                    <h3>{group.name}</h3>
                                </Room>
                            )
                        })
                    )}
            </RoomsContainer>

            <SelectChatType>

                <ChatTypeButton
                    className={currentRoomType === "contacts" && "selected"}
                    onClick={() => setCurrentRoomType("contacts")}
                >
                    <PersonIcon fontSize="large" />
                </ChatTypeButton>

                <ChatTypeButton
                    className={currentRoomType === "groups" && "selected"}
                    onClick={() => setCurrentRoomType("groups")}
                >
                    <GroupIcon fontSize="large" />
                </ChatTypeButton>

            </SelectChatType>
        </Container>
    );
};

export default Sidebar;
