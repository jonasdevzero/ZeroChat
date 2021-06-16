import { useState, useEffect } from "react"
import Fuse from "fuse.js"
import { groupService } from "../../../services"
import { useDispatch, useSelector } from 'react-redux'
import * as Actions from '../../../store/actions'
import { useTheme } from '../../../hooks'
import { Contact as ContactI } from "../../../types/user"

import {
    Container,
    Header,
    HeaderTitle,
    HeaderButton,
    Picture,
    PictureLabel,
    PictureInput,
    PictureRemove
} from "../../../styles/components/ChatScreens/BaseScreen"
import {
    Content,
    Form,
    Error,
    Fieldset,
    Legend,
    Label,
    Input,
    InputIcon,
    TextArea,
    Wrapper,
    Submit,
    SearchContacts,
    Contacts,
    Contact,
    Members,
    Member,
    RemoveMember,
    WithoutMembers
} from "../../../styles/components/ChatScreens/CreateGroup"
import { Avatar } from "@material-ui/core"
import {
    CloudUpload as CloudUploadIcon,
    Close as CloseIcon,
    Search as SearchIcon,
} from "@material-ui/icons"

export default function CreateGroup() {
    const contacts: ContactI[] = useSelector((state: any) => state.user.contacts)

    const [name, setName] = useState("")
    const [picture, setPicture] = useState<File>(undefined)
    const [description, setDescription] = useState("")
    const [members, setMembers] = useState<string[]>([])
    const [picturePreview, setPicturePreview] = useState("")

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState<ContactI[]>([])
    const [selectedContacts, setSelectedContacts] = useState<ContactI[]>([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)

    const [theme] = useTheme()
    const dispatch = useDispatch()

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        setLoading(true)
        setError(undefined)
        groupService.create({ name, description, picture: picture, members })
            .then(group => {
                dispatch(Actions.user.pushData(group, 'groups'))
                dispatch(Actions.room.setRoom(group, 'group'))
                dispatch(Actions.screen.setScreen(undefined))
            })
            .catch(error => setError(error))
            .then(() => setLoading(false))
    }

    function selectImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;

        const selectedImage = Array.from(e.target.files)[0]
        setPicture(selectedImage)
        setPicturePreview(URL.createObjectURL(selectedImage))
    }

    function removeImage() {
        setPicturePreview("")
        setPicture(undefined)
    }

    function selectContact(contact: ContactI) {
        setMembers([...members, contact.id])
        selectedContacts.push(contact)

        setSearch("")
    }

    function removeContact(contact: ContactI) {
        setMembers(members.filter(member => member !== contact.id))
        setSelectedContacts(selectedContacts.filter(selectedContact => selectedContact.id !== contact.id))
    }

    useEffect(() => {
        const fuse = new Fuse(contacts, { keys: ["username"] })
        let results: ContactI[] = []
        fuse.search(search).map(({ item }) => item).forEach(contact => {
            !(selectedContacts?.find(c => c.id === contact.id)) ? results.push(contact) : null
        })

        setSearchResult(results)
    }, [search, contacts])

    return (
        <Container>
            <Header>
                <HeaderTitle>Create Group</HeaderTitle>

                <HeaderButton onClick={() => dispatch(Actions.screen.removeScreen())}>
                    <CloseIcon />
                </HeaderButton>
            </Header>

            <Content>
                <Form onSubmit={onSubmit}>
                    {error && (<Error>{error}</Error>)}

                    <Fieldset>
                        <Legend>Data</Legend>

                        <Wrapper className="row">
                            <Picture>
                                {!picture ? (
                                    <>
                                        <PictureLabel htmlFor="picture">
                                            <CloudUploadIcon fontSize="large" />
                                        </PictureLabel>

                                        <PictureInput id="picture" type="file" onChange={selectImage} />
                                    </>
                                ) : (
                                    <PictureRemove type="button" onClick={() => removeImage()}>
                                        <CloseIcon fontSize="large" />
                                    </PictureRemove>
                                )}

                                <Avatar src={picturePreview} />
                            </Picture>

                            <Wrapper className="m-left">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" required value={name} onChange={e => setName(e.target.value)} />
                            </Wrapper>
                        </Wrapper>

                        <Wrapper>
                            <Label htmlFor="description">Description</Label>
                            <TextArea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                        </Wrapper>
                    </Fieldset>

                    <Fieldset>
                        <Legend>Members</Legend>

                        <SearchContacts>
                            <Wrapper>
                                <Input
                                    type="text"
                                    placeholder="Search contacts"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />

                                <InputIcon type="button" onClick={() => search.length ? setSearch("") : null}>
                                    {search.length ? (<CloseIcon />) : (<SearchIcon />)}
                                </InputIcon>
                            </Wrapper>

                            {searchResult.length ? (
                                <Contacts>
                                    {searchResult.map((contact, i) => {
                                        return (
                                            <Contact key={i} onClick={() => selectContact(contact)}>
                                                <Avatar src={contact.picture} />
                                                <p>{contact.username}</p>
                                            </Contact>
                                        )
                                    })}
                                </Contacts>
                            ) : null}
                        </SearchContacts>

                        <Members>
                            {selectedContacts.length ? (
                                <>
                                    {selectedContacts.map((selectedContact, i) => {
                                        return (
                                            <Member key={i}>
                                                <Avatar src={selectedContact.username} />

                                                <span>{selectedContact.username}</span>

                                                <RemoveMember type="button" onClick={() => removeContact(selectedContact)}>
                                                    <CloseIcon />
                                                </RemoveMember>
                                            </Member>
                                        )
                                    })}
                                </>
                            ) : (<WithoutMembers>Select contacts to your group</WithoutMembers>)}
                        </Members>
                    </Fieldset>

                    <Submit type="submit">
                        {loading ? (<img src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`} alt="loading" />) : "Create"}
                    </Submit>
                </Form>
            </Content>
        </Container>
    )
}
