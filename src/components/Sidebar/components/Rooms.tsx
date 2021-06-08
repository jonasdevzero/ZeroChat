import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { usePersistedState } from "../../../hooks"
import Fuse from "fuse.js"
import * as Actions from '../../../store/actions'

import {
    Search,
    SearchInputWrapper,
    SearchInput,
    SearchButton,
    ContactFilters,
    Filter,
    RoomsContainer,
    Room,
    Status,
    UnreadMessages,
    PlusButton,
    PendingInvitations
} from "../../../styles/components/Sidebar/Rooms"
import { Avatar } from "@material-ui/core"
import {
    Search as SearchIcon,
    Add as AddIcon
} from "@material-ui/icons"

function Rooms({ roomsType }: { roomsType: string }) {
    const userRooms = useSelector(({ user }: any) => ({ contacts: user.contacts, groups: user.groups }))
    const pendingInvitations = useSelector(({ user }: any) => user.invitations.length)

    const [rooms, setRooms] = useState<any[]>(userRooms.contacts)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = usePersistedState<"all" | "online" | "offline">("contact_list_filter", "all")
    const dispatch = useDispatch()

    useEffect(() => setRooms(userRooms[roomsType]), [roomsType])

    useEffect(() => {
        const fuse = new Fuse(rooms, { keys: ['name', 'username'] })
        search.length ? setRooms(fuse.search(search).map(({ item }) => item)) : setRooms(userRooms[roomsType])
    }, [search])

    function selectRoom(room: any) {
        const roomType = roomsType === 'contacts' ? 'contact' : 'group'
        setSearch('')
        dispatch(Actions.room.setRoom(room, roomType))
    }

    function onClickPlus() {
        const screen = roomsType === 'contacts' ? 'Add Contact' : 'Create Group'
        dispatch(Actions.screen.setScreen(screen))
    }

    return (
        <>
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

            <RoomsContainer>
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

                <PlusButton onClick={() => onClickPlus()}>
                    <AddIcon fontSize='large' />

                    {roomsType === 'contacts' && pendingInvitations ? (
                        <PendingInvitations>{pendingInvitations}</PendingInvitations>
                    ) : null}
                </PlusButton>
            </RoomsContainer>
        </>
    )
}

export default Rooms
