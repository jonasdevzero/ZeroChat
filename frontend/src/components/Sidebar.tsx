import { useRouter } from "next/router";
import { useState } from "react";

import { UserI, ContactI, GroupI } from "../types/user";

import {
    Container,
    Header,
    User,
    Inner,
    RoomsContainer,
    Rooms,
    Search,
    SearchInput,
    SearchButton,
    Room,
    Options,
    Status,
    OptionButton,
    UnreadMessages
} from "../styles/components/Sidebar";
import { Avatar, IconButton } from "@material-ui/core";
import {
    Person as PersonIcon,
    Group as GroupIcon,
    PersonAdd as PersonAddIcon,
    GroupAdd as GroupAddIcon,
    MoreVert as MoreVertIcon,
    Brightness3 as Brightness3Icon,
    Brightness7 as Brightness7Icon,
    PowerSettingsNew as PowerSettingsNewIcon,
    Search as SearchIcon,
} from "@material-ui/icons";

interface SidebarI {
    user: UserI;
    setToken: React.Dispatch<React.SetStateAction<string>>;

    setCurrentContainer: React.Dispatch<React.SetStateAction<"contacts" | "groups" | "profile" | "addContact" | "createGroup">>;

    currentRoomType: "contacts" | "groups";
    setCurrentRoomType: React.Dispatch<React.SetStateAction<"contacts" | "groups">>;

    setCurrentContact: React.Dispatch<React.SetStateAction<ContactI>>;
    setCurrentGroup: React.Dispatch<React.SetStateAction<GroupI>>;

    theme: "light" | "dark";
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
};

function Sidebar({ user, setToken, setCurrentContainer, setCurrentContact, setCurrentGroup, currentRoomType, setCurrentRoomType, theme, setTheme }: SidebarI) {
    const router = useRouter();

    const [search, setSearch] = useState("");

    return (
        <Container>
            <Header>
                <User onClick={() => setCurrentContainer("profile")}>
                    <Avatar src={user?.picture} />
                    <h2>{user?.username}</h2>
                </User>

                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Header>

            <Inner>
                <Options>
                    <div>
                        <OptionButton
                            className={`option ${currentRoomType === "contacts" && "selected"}`}
                            onClick={() => {
                                setCurrentGroup(undefined);
                                setCurrentContainer("contacts");
                                setCurrentRoomType("contacts");
                            }}
                        >
                            <PersonIcon />
                        </OptionButton>

                        <OptionButton
                            className={`option ${currentRoomType === "groups" && "selected"}`}
                            onClick={() => {
                                setCurrentContact(undefined);
                                setCurrentContainer("groups")
                                setCurrentRoomType("groups");
                            }}
                        >
                            <GroupIcon />
                        </OptionButton>

                        <OptionButton
                            className="option"
                            onClick={() => setCurrentContainer("addContact")}
                        >
                            <PersonAddIcon />
                        </OptionButton>

                        <OptionButton
                            className="option"
                            onClick={() => setCurrentContainer("createGroup")}
                        >
                            <GroupAddIcon />
                        </OptionButton>
                    </div>

                    <div>
                        <OptionButton
                            className="theme"
                            onClick={() => theme === "dark" ? setTheme("light") : setTheme("dark")}
                        >
                            {theme === "dark" ? (
                                <Brightness3Icon />
                            ) : (
                                <Brightness7Icon />
                            )}
                        </OptionButton>

                        <OptionButton
                            className="off"
                            onClick={() => {
                                setToken("");
                                router.push("/");
                            }}
                        >
                            <PowerSettingsNewIcon />
                        </OptionButton>
                    </div>
                </Options>

                <RoomsContainer>
                    <Search>
                        <SearchInput
                            type="text"
                            placeholder={`Find a ${currentRoomType === "contacts" ? "contact" : "group"}`}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />

                        <SearchButton type="button">
                            <SearchIcon />
                        </SearchButton>
                    </Search>

                    <Rooms>
                        {currentRoomType === "contacts" ? (
                            user?.contacts?.map((contact, i) => {
                                return contact.active ? (
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
                                ) : null;
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
                    </Rooms>
                </RoomsContainer>
            </Inner>
        </Container>
    );
};

export default Sidebar;
