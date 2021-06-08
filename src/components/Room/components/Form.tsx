import { useState } from 'react'
import { useSelector } from 'react-redux'
import { messagesService } from '../../../services'
import { Picker, BaseEmoji } from "emoji-mart"
import { useWarn } from '../../../hooks'

import {
    Container,
    Inner,
    Input,
    Submit,
    IconButton,
    EmojiPickerContainer,
} from '../../../styles/components/Room/Form'
import {
    Telegram as SendIcon,
    InsertEmoticon as InsertEmoticonIcon,
    Mic as MicIcon,
    AttachFile as AttachFileIcon,
} from "@material-ui/icons"
import "emoji-mart/css/emoji-mart.css"

function MessageForm() {
    const { current: room, type: roomType } = useSelector((state: any) => state.room)
    const [message, setMessage] = useState("")

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const warn = useWarn()

    function handleMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        setShowEmojiPicker(false)
        messagesService.create({ roomType, to: room.id, text: message, medias: [] })
            .then(() => setMessage(""))
            .catch(error => warn.error(error))
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
