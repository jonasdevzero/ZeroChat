import { useSelector } from 'react-redux'
import { messagesUtil } from '../../../utils'
import moment from 'moment'

import {
    Message,
    Inner,
    Text,
    Time,
    Day,
    User,
    Username
} from '../../../styles/components/Room/components/Messages'
import { Avatar } from "@material-ui/core"

function Messages({ messages }) {
    const userId = useSelector((state: any) => state.user.id)
    const roomType = useSelector((state: any) => state.currentRoom.type)

    return (
        <>
            {messagesUtil.orderMessages(messages).map((msg, i, arr) => {
                if (msg.type && msg.type === "day") {
                    return <Day key={i}>{msg.date}</Day>
                };

                return (
                    <Message key={i} className={msg?.sender_id === arr[i - 1]?.sender_id && "concat"}>
                        {roomType === 'group' && msg?.sender_id !== userId && msg?.sender_id !== arr[i - 1]?.sender_id ? (
                            <User>
                                <Avatar src={msg.sender.image} />
                                <Username>{msg.sender.username}</Username>
                            </User>
                        ) : null}

                        <Inner className={msg?.sender_id === userId && "sender"}>
                            <Text>{msg.text}</Text>
                            <Time>{moment(msg.created_at).format("HH:mm A")}</Time>
                        </Inner>
                    </Message>
                );
            })}
        </>
    )
}

export default Messages
