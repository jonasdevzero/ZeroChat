import { useState } from 'react'
import { useSelector } from 'react-redux'
import { messagesService } from '../../../services'
import { Picker, BaseEmoji } from "emoji-mart";

import { Form } from '../../../styles/components/Messages'
import {
    Send as SendIcon,
    InsertEmoticon as InsertEmoticonIcon,
    Mic as MicIcon,
    AttachFile as AttachFileIcon,
} from "@material-ui/icons";

function MessageForm() {
    const { room, type: roomType } = useSelector((state: any) => state.currentRoom)
    const [message, setMessage] = useState("")

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    async function handleMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        setShowEmojiPicker(false)
        messagesService.create({ roomType, to: room.id, text: message, medias: [] })
            .then(() => setMessage(""))
            .catch(_error => {})
    }

    return (
        <Form onSubmit={handleMessage}>
            {showEmojiPicker ? (
                <Form.EmojiPickerContainer>
                    <Picker onSelect={(emoji: BaseEmoji) => setMessage(message.concat(emoji.native))} />
                </Form.EmojiPickerContainer>
            ) : null}

            <Form.IconButton type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <InsertEmoticonIcon fontSize="large" />
            </Form.IconButton>

            <Form.IconButton type="button" onClick={() => { }}>
                <AttachFileIcon fontSize="large" />
            </Form.IconButton>

            <Form.Inner>
                <Form.Input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    autoComplete="off"
                    onFocus={() => setShowEmojiPicker(false)}
                />

                <Form.Submit type="submit">
                    <SendIcon fontSize="large" />
                </Form.Submit>
            </Form.Inner>

            <Form.IconButton type="button" onClick={() => { }}>
                <MicIcon fontSize="large" />
            </Form.IconButton>
        </Form>
    )
}

export default MessageForm
