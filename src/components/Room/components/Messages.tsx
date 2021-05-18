import { useSelector } from 'react-redux'
import { messagesUtil } from '../../../utils'
import moment from 'moment'

import { Message } from '../../../styles/components/Messages'
import { Avatar } from "@material-ui/core"

function Messages({ messages }) {
    const userId = useSelector((state: any) => state.user.id)
    const roomType = useSelector((state: any) => state.currentRoom.type)

    return (
        <>
            {messagesUtil.orderMessages(messages).map((msg, i, arr) => {
                if (msg.type && msg.type === "day") {
                    return <Message.Day key={i}>{msg.date}</Message.Day>
                };

                return (
                    <Message key={i} className={msg?.sender_id === arr[i - 1]?.sender_id && "concat"}>
                        {roomType === 'group' && msg?.sender_id !== userId && msg?.sender_id !== arr[i - 1]?.sender_id ? (
                            <Message.User>
                                <Avatar src={msg.sender.image} />

                                <Message.User.Username>
                                    {msg.sender.username}
                                </Message.User.Username>
                            </Message.User>
                        ) : null}

                        <Message.Inner className={msg?.sender_id === userId && "sender"}>
                            <Message.Text>
                                {msg.text}
                            </Message.Text>

                            <Message.Time>
                                {moment(msg.created_at).format("HH:mm A")}
                            </Message.Time>
                        </Message.Inner>
                    </Message>
                );
            })}
        </>
    )
}

export default Messages
