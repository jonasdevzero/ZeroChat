import { UserI, ContactI, GroupI } from "../types/user";

import {
    Container,
    Header,
    User,
    Inner,
    RoomsContainer,
    Room,
    Options,
    Status,
    ChatTypeButton,
    UnreadMessages
} from "../styles/components/Sidebar";
import { Avatar, IconButton } from "@material-ui/core";
import {
    Person as PersonIcon,
    Group as GroupIcon,
    MoreVert as MoreVertIcon,
} from "@material-ui/icons";

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
                <User>
                    <Avatar src={user?.picture} />
                    <h2>{user?.username}</h2>
                </User>

                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Header>

            <Inner>
                <Options>

                    <ChatTypeButton
                        className={currentRoomType === "contacts" && "selected"}
                        onClick={() => {
                            setCurrentGroup(undefined);
                            setCurrentRoomType("contacts");
                        }}
                    >
                        <PersonIcon />
                    </ChatTypeButton>

                    <ChatTypeButton
                        className={currentRoomType === "groups" && "selected"}
                        onClick={() => {
                            setCurrentContact(undefined)
                            setCurrentRoomType("groups")
                        }}
                    >
                        <GroupIcon />
                    </ChatTypeButton>

                </Options>

                <RoomsContainer>
                    {currentRoomType === "contacts" ? (
                        user?.contacts?.map((contact, i) => {
                            return (
                                <Room
                                    key={i}
                                    onClick={() => setCurrentContact(contact)}
                                >
                                    <Avatar src={contact.image} />
                                    <h3>{contact.username}</h3>
                                    <Status className={contact.online ? "online" : "offline"} />

                                    {contact.unread_messages ? (
                                        <UnreadMessages>
                                            {contact.unread_messages}
                                        </UnreadMessages>
                                    ) : null}
                                </Room>
                            );
                        })
                    ) : (
                        user?.groups?.map((group, i) => {
                            return (
                                <Room
                                    key={i}
                                    onClick={() => setCurrentGroup(group)}
                                >
                                    <Avatar src={group.image} />
                                    <h3>{group.name}</h3>
                                </Room>
                            )
                        })
                    )}
                </RoomsContainer>
            </Inner>
        </Container>
    );
};

export default Sidebar;
