import { useRouter } from "next/router";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Fuse from "fuse.js";
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux'
import { toggleCallMinimized } from '../store/actions/call'
import { setCurrentRoom, removeCurrentRoom } from '../store/actions/currentRoom'

import { UserI } from "../types/user";

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
import { Avatar } from "@material-ui/core";
import {
    Person as PersonIcon,
    Group as GroupIcon,
    PersonAdd as PersonAddIcon,
    GroupAdd as GroupAddIcon,
    Brightness3 as Brightness3Icon,
    Brightness7 as Brightness7Icon,
    PowerSettingsNew as PowerSettingsNewIcon,
    Search as SearchIcon,
    Call as CallIcon,
} from "@material-ui/icons";

interface SidebarI {
    user: UserI;
    currentContainer: 'profile' | "messages" | "addContact" | "createGroup";
    setCurrentContainer: Dispatch<SetStateAction<'profile' | "messages" | "addContact" | "createGroup">>;
    theme: "light" | "dark";
    setTheme: Dispatch<SetStateAction<"light" | "dark">>;
};

export default function Sidebar({
    user,
    currentContainer,
    setCurrentContainer,
    theme,
    setTheme,
}: SidebarI) {
    const [rooms, setRooms] = useState<any[]>(user.contacts)
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState<any[]>(undefined)

    const callMinimized = useSelector((state: any) => state.call.minimized)

    const [roomsType, setRoomsType] = useState<"contacts" | "groups">("contacts")

    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        const fuse = new Fuse(rooms, { keys: ["name", "username"] });
        const result = fuse.search(search).map(({ item }) => item);
        setSearchResult(result);
    }, [search, user.contacts, user.groups]);

    useEffect(() => roomsType === "contacts" ? setRooms(user.contacts) : setRooms(user.groups), [roomsType, user.contacts, user.groups]);

    function changeContainer(option: 'profile' | "messages" | "addContact" | "createGroup", type?: "contacts" | "groups") {
        option === "messages" ? setRoomsType(type) : dispatch(removeCurrentRoom());
        setCurrentContainer(option);
    };

    function selectRoom(room: any, type: "contact" | "group") {
        setSearch("");
        setCurrentContainer("messages");
        dispatch(setCurrentRoom(room, type))
    };

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    function logOut() {
        Cookies.remove('token');
        router.replace("/");
    };

    return (
        <Container>
            <Header>
                <User onClick={() => changeContainer('profile')}>
                    <Avatar src={user.picture} />
                    <h2>{user.username}</h2>
                </User>
            </Header>

            <Inner>
                <Options>
                    <div>
                        <OptionButton
                            className={`option ${currentContainer === "messages" && roomsType === "contacts" && "selected"}`}
                            onClick={() => changeContainer("messages", "contacts")}
                        >
                            <PersonIcon />
                        </OptionButton>

                        <OptionButton
                            className={`option ${currentContainer === "messages" && roomsType === "groups" && "selected"}`}
                            onClick={() => changeContainer("messages", "groups")}
                        >
                            <GroupIcon />
                        </OptionButton>

                        <OptionButton
                            className={`option ${currentContainer === "addContact" && "selected"}`}
                            onClick={() => changeContainer("addContact")}
                        >
                            <PersonAddIcon />
                        </OptionButton>

                        <OptionButton
                            className={`option ${currentContainer === "createGroup" && "selected"}`}
                            onClick={() => changeContainer("createGroup")}
                        >
                            <GroupAddIcon />
                        </OptionButton>
                    </div>

                    <div>
                        {callMinimized ? (
                            <OptionButton className='option' onClick={() => dispatch(toggleCallMinimized())}>
                                <CallIcon />
                            </OptionButton>
                        ) : null}

                        <OptionButton className="theme" onClick={() => toggleTheme()} >
                            {theme === "dark" ? (<Brightness3Icon />) : (<Brightness7Icon />)}
                        </OptionButton>

                        <OptionButton className="off" onClick={() => logOut()} >
                            <PowerSettingsNewIcon />
                        </OptionButton>
                    </div>
                </Options>

                <RoomsContainer>
                    <Search>
                        <SearchInput
                            type="text"
                            placeholder={`Find a ${roomsType}`}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />

                        <SearchButton type="button">
                            <SearchIcon />
                        </SearchButton>
                    </Search>

                    <Rooms>
                        {(search.length > 0 ? searchResult : rooms).map(room => {
                            return (
                                <Room key={room.id} onClick={() => selectRoom(room, roomsType === "contacts" ? "contact" : "group")}>
                                    <Avatar src={room.image} />
                                    <h3>{roomsType === "contacts" ? room.username : room.name}</h3>

                                    {roomsType === "contacts" ? (<Status className={room.online ? "online" : "offline"} />) : null}
                                    {room.unread_messages > 0 ? (<UnreadMessages>{room.unread_messages}</UnreadMessages>) : null}
                                </Room>
                            );
                        })}
                    </Rooms>
                </RoomsContainer>
            </Inner>
        </Container>
    );
};
