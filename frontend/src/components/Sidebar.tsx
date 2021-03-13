import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Fuse from "fuse.js";

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

    setCurrentContact: React.Dispatch<React.SetStateAction<ContactI>>;
    setCurrentGroup: React.Dispatch<React.SetStateAction<GroupI>>;

    theme: "light" | "dark";
    setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
};

function Sidebar({
    user,
    setToken,
    setCurrentContainer,
    setCurrentContact,
    setCurrentGroup,
    theme,
    setTheme
}: SidebarI) {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [currentRoomType, setCurrentRoomType] = useState<"contacts" | "groups">("contacts");

    useEffect(() => {
        if (currentRoomType === "contacts" && user?.contacts) {
            const fuse = new Fuse(user.contacts, { keys: ["username"] });
            const result = fuse.search(search).map(({ item }) => item);
            setSearchResult(result);
        } else if (currentRoomType === "groups" && user?.groups) {
            const fuse = new Fuse(user?.groups, { keys: ["name"] });
            const result = fuse.search(search).map(({ item }) => item);
            setSearchResult(result);
        };
    }, [search, user?.contacts, user?.groups]);

    return (
        <Container>
            <Header>
                <User onClick={() => {
                    setCurrentContainer("profile")
                    setCurrentContact(undefined);
                    setCurrentGroup(undefined);
                }}>
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
                                setCurrentContainer("contacts");
                                setCurrentRoomType("contacts");
                            }}
                        >
                            <PersonIcon />
                        </OptionButton>

                        <OptionButton
                            className={`option ${currentRoomType === "groups" && "selected"}`}
                            onClick={() => {
                                setCurrentContainer("groups")
                                setCurrentRoomType("groups");
                            }}
                        >
                            <GroupIcon />
                        </OptionButton>

                        <OptionButton
                            className="option"
                            onClick={() => {
                                setCurrentContainer("addContact");
                                setCurrentContact(undefined);
                                setCurrentGroup(undefined);
                            }}
                        >
                            <PersonAddIcon />
                        </OptionButton>

                        <OptionButton
                            className="option"
                            onClick={() => {
                                setCurrentContainer("createGroup");
                                setCurrentContact(undefined);
                                setCurrentGroup(undefined);
                            }}
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
                            search.length > 0 ? (
                                searchResult.map((contact, i) => {
                                    return contact.active ? (
                                        <Room
                                            key={i}
                                            onClick={() => {
                                                setSearch("");
                                                setCurrentContainer("contacts");
                                                setCurrentGroup(undefined);
                                                setCurrentContact(contact);
                                            }}
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
                                user?.contacts?.map((contact, i) => {
                                    return contact.active ? (
                                        <Room
                                            key={i}
                                            onClick={() => {
                                                setCurrentContainer("contacts");
                                                setCurrentGroup(undefined);
                                                setCurrentContact(contact);
                                            }}
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
                            )
                        ) : (
                            search.length > 0 ? (
                                searchResult.map((group, i) => {
                                    return (
                                        <Room
                                            key={i}
                                            onClick={() => {
                                                setSearch("");
                                                setCurrentContainer("groups");
                                                setCurrentContact(undefined);
                                                setCurrentGroup(group);
                                            }}
                                        >
                                            <Avatar src={group.image} />
                                            <h3>{group.name}</h3>
                                        </Room>
                                    )
                                })
                            ) : (
                                user?.groups?.map((group, i) => {
                                    return (
                                        <Room
                                            key={i}
                                            onClick={() => {
                                                setCurrentContainer("groups");
                                                setCurrentContact(undefined);
                                                setCurrentGroup(group);
                                            }}
                                        >
                                            <Avatar src={group.image} />
                                            <h3>{group.name}</h3>
                                        </Room>
                                    )
                                })
                            )
                        )}
                    </Rooms>
                </RoomsContainer>
            </Inner>
        </Container>
    );
};

export default Sidebar;
