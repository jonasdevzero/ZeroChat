import { useState } from 'react'
import { useSelector } from 'react-redux'
import { messagesService } from '../../../services'
import { Picker, BaseEmoji } from "emoji-mart"

import {
    Container,
    Inner,
    Input,
    Submit,
    IconButton,
    EmojiPickerContainer,
} from '../../../styles/components/Room/components/Form'
import {
    Send as SendIcon,
    InsertEmoticon as InsertEmoticonIcon,
    Mic as MicIcon,
    AttachFile as AttachFileIcon,
} from "@material-ui/icons"

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
        <Container onSubmit={handleMessage}>
            {showEmojiPicker ? (
                <EmojiPickerContainer>
                    <Picker onSelect={(emoji: BaseEmoji) => setMessage(message.concat(emoji.native))} />
                </EmojiPickerContainer>
            ) : null}

            <IconButton type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <InsertEmoticonIcon fontSize="large" />
            </IconButton>

            <IconButton type="button" onClick={() => { }}>
                <AttachFileIcon fontSize="large" />
            </IconButton>

            <Inner>
                <Input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    autoComplete="off"
                    onFocus={() => setShowEmojiPicker(false)}
                />

                <Submit type="submit">
                    <SendIcon fontSize="large" />
                </Submit>
            </Inner>

            <IconButton type="button" onClick={() => { }}>
                <MicIcon fontSize="large" />
            </IconButton>
        </Container>
    )
}

export default MessageForm
