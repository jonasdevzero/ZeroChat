import { socket } from '../../../services'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import *  as CallActions from '../../../store/actions/call'

import Dropdown from '../../../styles/components/Dropdown'
import { Header, Room } from '../../../styles/components/Room/components/Header'
import { Avatar, IconButton } from "@material-ui/core";
import {
    MoreVert as MoreVertIcon,
    Call as CallIcon,
    Videocam as VideocamIcon,
} from "@material-ui/icons";

interface RoomHeaderI {
    setShowRoomDetail: React.Dispatch<React.SetStateAction<boolean>>
}

function RoomHeader({ setShowRoomDetail }: RoomHeaderI) {
    const [showDropdown, setShowDropdown] = useState(false)
    const { room, roomType } = useSelector(({ room }: any) => ({ room: room.current, roomType: room.type }))

    const dispatch = useDispatch()

    useEffect(() => setShowDropdown(false))

    function startCall(room, type: 'audio' | 'video') {
        socket.emit('is-online', room.id, (_, isOnline) => isOnline ? dispatch(CallActions.callStart(room, type)) : null)
    }

    return (
        <Header>
            <Room onClick={() => setShowRoomDetail(true)}>
                <Avatar src={room.picture} />

                <h2>{roomType === 'contact' ? room.username : room.name}</h2>
            </Room>

            {roomType === "contact" ? (
                <>
                    <IconButton onClick={() => startCall(room, 'audio')}>
                        <CallIcon />
                    </IconButton>

                    <IconButton onClick={() => startCall(room, 'video')}>
                        <VideocamIcon />
                    </IconButton>
                </>
            ) : null}

            <Dropdown.Wrapper>
                <IconButton onClick={() => setShowDropdown(!showDropdown)}>
                    <MoreVertIcon />
                </IconButton>

                {showDropdown ? (
                    <Dropdown>
                        <Dropdown.Item onClick={() => { }}>
                            {roomType} info
                        </Dropdown.Item>

                        <Dropdown.Item onClick={() => { }}>
                            Leave Group
                        </Dropdown.Item>
                    </Dropdown>
                ) : null}
            </Dropdown.Wrapper>
        </Header>
    )
}

export default RoomHeader
