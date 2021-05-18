import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import Fuse from "fuse.js";
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux'
import { usePersistedState } from '../hooks'
import { socket } from '../services'
import * as UserActions from '../store/actions/user'
import * as CurrentRoomActions from '../store/actions/currentRoom'
import * as CurrentContainerActions from '../store/actions/currentContainer'
import * as CallActions from '../store/actions/call'

import { UserI } from "../types/user";

import {
    Container,
    Options,
    User,
    OptionsInner,
    OptionsPlus,
    Option,
    Inner,
    Header,
    Title,
    Rooms,
    Search,
    SearchInputWrapper,
    SearchInput,
    SearchButton,
    ContactFilters,
    Filter,
    Room,
    Status,
    UnreadMessages
} from "../styles/components/Sidebar";
import { Avatar } from "@material-ui/core";
import {
    Person as PersonIcon,
    Group as GroupIcon,
    Brightness3 as Brightness3Icon,
    Brightness7 as Brightness7Icon,
    PowerSettingsNew as PowerSettingsNewIcon,
    Search as SearchIcon,
    Call as CallIcon,
} from "@material-ui/icons";

interface SidebarI {
    theme: "light" | "dark";
    setTheme: Dispatch<SetStateAction<"light" | "dark">>;
};

export default function Sidebar({ theme, setTheme }: SidebarI) {
    const user: UserI = useSelector((state: any) => state.user)
    const [rooms, setRooms] = useState<any[]>(user.contacts)

    const [search, setSearch] = useState("")

    const [roomsType, setRoomsType] = useState<"contacts" | "groups">("contacts")

    const [filter, setFilter] = usePersistedState<"all" | "online" | "offline">("contact_list_filter", "all")

    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        socket.on("new-group", (group) => {
            socket.emit("join-group", group.id)
            dispatch(UserActions.pushRoom({ roomType: 'group', room: group }))
        })
        socket.on('update', action => dispatch(action))
    }, [])

    useEffect(() => {
        const fuse = new Fuse(rooms, { keys: ['name', 'username'] })
        search.length ? setRooms(fuse.search(search).map(({ item }) => item)) : setRooms(user[roomsType])
    }, [search])

    function changeRooms(type: "contacts" | "groups") {
        setRooms(user[type])
        setRoomsType(type)
    }

    function selectRoom(room: any) {
        const roomType = roomsType === 'contacts' ? 'contact' : 'group'
        setSearch('')
        dispatch(CurrentRoomActions.setCurrentRoom(room, roomType))
    }

    function logOut() {
        Cookies.remove('token')
        router.replace('/')
    }

    return (
        <Container>
            <Options>
                <User>
                    <Avatar src={user.picture} />
                </User>

                <OptionsInner>
                    <Option onClick={() => changeRooms("contacts")}>
                        <PersonIcon />
                    </Option>

                    <Option onClick={() => changeRooms("groups")}>
                        <GroupIcon />
                    </Option>

                    <Option onClick={() => dispatch(CallActions.toggleCallMinimized())}>
                        <CallIcon />
                    </Option>
                </OptionsInner>

                <OptionsPlus>
                    <Option onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} >
                        {theme === "dark" ? (<Brightness3Icon />) : (<Brightness7Icon />)}
                    </Option>

                    <Option onClick={() => logOut()} >
                        <PowerSettingsNewIcon />
                    </Option>
                </OptionsPlus>
            </Options>

            <Inner>
                <Header>
                    <Title>Contacts</Title>

                    {rooms.find(room => room.unread_messages > 0) ? (
                        <UnreadMessages className='total'>
                            {rooms.reduce((acc, crr) => acc += crr.unread_messages, 0)}
                        </UnreadMessages>
                    ) : null}
                </Header>

                <Search>
                    <SearchInputWrapper>
                        <SearchInput
                            type="text"
                            placeholder={`Find ${roomsType}`}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <SearchButton type="button">
                            <SearchIcon />
                        </SearchButton>
                    </SearchInputWrapper>

                    {roomsType === 'contacts' ? (
                        <ContactFilters>
                            <Filter className={filter === 'all' && 'selected'} type="button" onClick={() => setFilter("all")}>
                                All
                            </Filter>

                            <Filter className={filter === 'online' && 'selected'} type="button" onClick={() => setFilter("online")}>
                                Online
                            </Filter>

                            <Filter className={filter === 'offline' && 'selected'} type="button" onClick={() => setFilter("offline")}>
                                Offline
                            </Filter>
                        </ContactFilters>
                    ) : null}
                </Search>

                <Rooms>
                    {rooms.map(room => {
                        return (
                            <Room key={room.id} onClick={() => selectRoom(room)}>
                                <Avatar src={room.image} />
                                <h3>{roomsType === "contacts" ? room.username : room.name}</h3>

                                {roomsType === "contacts" ? (<Status className={room.online ? "online" : "offline"} />) : null}
                                {room.unread_messages > 0 ? (<UnreadMessages>{room.unread_messages}</UnreadMessages>) : null}
                            </Room>
                        );
                    })}
                </Rooms>
            </Inner>
        </Container>
    );
};
