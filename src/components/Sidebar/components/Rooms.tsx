import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { usePersistedState } from "../../../hooks"
import Fuse from "fuse.js"
import * as CurrentRoomActions from '../../../store/actions/currentRoom'

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
} from "../../../styles/components/Sidebar/components/Rooms"
import { Avatar } from "@material-ui/core"
import { Search as SearchIcon } from "@material-ui/icons"

function Rooms({ roomsType }: { roomsType: string }) {
    const userRooms = useSelector(({ user }: any) => ({ contacts: user.contacts, groups: user.groups }))

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
        dispatch(CurrentRoomActions.setCurrentRoom(room, roomType))
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
            </RoomsContainer>
        </>
    )
}

export default Rooms
