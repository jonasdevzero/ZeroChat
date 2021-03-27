import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { UserI, ContactI, GroupI } from "../types/user";
import Fuse from "fuse.js";
import api from "../services/api";
import { SetUserMasterI } from "../types/useSetUserMaster";

import {
    Container,
    Header,
    Inner,
    Form,
    InputWrapper,
    Label,
    Input,
    ImageWrapper,
    ImageLabel,
    ImageInput,
    RemoveImage,
    Button,
} from "../styles/components/Container";
import {
    InputContainer,
    SearchOrCloseButton,
    Wrapper,
    TextArea,
    Fieldset,
    Legend,
    SearchInput,
    SearchInputWrapper,
    FilteredContacts,
    FilteredContact,
    SelectedContacts,
    SelectedContact,
    RemoveSelectedContact,
    ContainerWithoutContacts,
} from "../styles/components/CreateGroup";
import { Avatar } from "@material-ui/core";
import {
    CloudUpload as CloudUploadIcon,
    Close as CloseIcon,
    Search as SearchIcon,
} from "@material-ui/icons";

interface CreateGroupI {
    user: UserI;
    setUserMaster: SetUserMasterI;
    setCurrentContainer: Dispatch<SetStateAction<"profile" | "messages" | "addContact" | "createGroup">>;
    setCurrentRoom: Dispatch<SetStateAction<ContactI & GroupI>>;
    setCurrentRoomType: Dispatch<SetStateAction<"contact" | "group">>;
    socket: SocketIOClient.Socket;
    theme: "light" | "dark";
};

export default function CreateGroup({ user, setUserMaster, setCurrentRoomType, setCurrentRoom, setCurrentContainer, socket, theme }: CreateGroupI) {
    const [name, setName] = useState("");
    const [image, setImage] = useState<File>(undefined);
    const [description, setDescription] = useState("");
    const [members, setMembers] = useState<string[]>([]);

    const [selectedContacts, setSelectedContacts] = useState<ContactI[]>([])

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState<ContactI[]>()

    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData();
        data.append("name", name);
        data.append("image", image);
        data.append("description", description);

        members.forEach(member => data.append("members", member));

        setLoading(true);

        await api.post(`/group`, data).then(response => {
            const group = response.data.group;
            group.messages = [];
            setLoading(false);

            socket.emit("group", { event: "new", data: { event: "new", group, members } }, () => {
                setUserMaster.groups.push(group).then(() => {
                    setCurrentRoomType("group");
                    setCurrentRoom(group);
                    setCurrentContainer("messages");
                });
            });
        });

    };

    function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;

        const selectedImage = Array.from(e.target.files)[0];
        setImage(selectedImage);

        const imagePreview = URL.createObjectURL(selectedImage);

        setImagePreview(imagePreview);
    };

    function removeSelectedImage() {
        setImagePreview("");
        setImage(undefined);
    };

    function selectContact(contact: ContactI) {
        setMembers([...members, contact.id]);
        selectedContacts.push(contact);

        setSearch("");
    };

    function removeSelectedContact(contact: ContactI) {
        setMembers(members.filter(member => member !== contact.id));
        setSelectedContacts(selectedContacts.filter(selectedContact => selectedContact.id !== contact.id));
    };

    useEffect(() => {
        const fuse = new Fuse(user.contacts, { keys: ["username"] });
        let results: ContactI[] = [];
        fuse.search(search).map(({ item }) => item).forEach(contact => {
            if (!(selectedContacts?.find(c => c.id === contact.id))) {
                results.push(contact);
            };
        });

        setSearchResult(results);
    }, [search, user?.contacts])

    return (
        <Container>
            <Header>
                <h1>Create Group</h1>
            </Header>

            <Inner>
                <Form onSubmit={onSubmit}>
                    <Fieldset>
                        <Legend>Group Data</Legend>

                        <InputWrapper className="row">
                            <ImageWrapper>
                                {!image ? (
                                    <>
                                        <ImageLabel htmlFor="image">
                                            <CloudUploadIcon fontSize="large" />
                                        </ImageLabel>

                                        <ImageInput
                                            id="image"
                                            type="file"
                                            onChange={handleSelectImage}
                                        />
                                    </>
                                ) : (
                                    <RemoveImage type="button" onClick={() => removeSelectedImage()}>
                                        <CloseIcon fontSize="large" />
                                    </RemoveImage>
                                )}
                                <Avatar src={imagePreview} />
                            </ImageWrapper>

                            <Wrapper>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </Wrapper>
                        </InputWrapper>

                        <InputWrapper>
                            <Label>description</Label>

                            <TextArea
                                value={description}
                                onChange={e => setDescription(e.target.value)}

                            />
                        </InputWrapper>
                    </Fieldset>

                    <Fieldset>
                        <Legend>Group Members</Legend>

                        <SearchInputWrapper>
                            <InputContainer>
                                <SearchInput
                                    type="text"
                                    placeholder="Search contacts"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />

                                <SearchOrCloseButton type="button" onClick={() => search.length > 0 ? setSearch("") : null}>
                                    {search.length > 0 ? (
                                        <CloseIcon />
                                    ) : (
                                        <SearchIcon />
                                    )}
                                </SearchOrCloseButton>
                            </InputContainer>

                            {searchResult?.length > 0 ? (
                                <FilteredContacts>
                                    {searchResult.map(contact => {
                                        return (
                                            <FilteredContact key={contact.id} onClick={() => selectContact(contact)}>
                                                <Avatar src={contact?.image} />
                                                <p>{contact.username}</p>
                                            </FilteredContact>
                                        );
                                    })}
                                </FilteredContacts>
                            ) : null}
                        </SearchInputWrapper>

                        <SelectedContacts>
                            {selectedContacts.length > 0 ? (
                                <>
                                    {selectedContacts.map((selectedContact, i) => {
                                        return (
                                            <SelectedContact key={i}>
                                                <Avatar src={selectedContact.username} />
                                                <span>{selectedContact.username}</span>

                                                <RemoveSelectedContact
                                                    type="button"
                                                    onClick={() => removeSelectedContact(selectedContact)}
                                                >
                                                    <CloseIcon />
                                                </RemoveSelectedContact>
                                            </SelectedContact>
                                        );
                                    })}
                                </>
                            ) : (
                                <ContainerWithoutContacts>
                                    <strong>Select contacts to your group</strong>
                                </ContainerWithoutContacts>
                            )}
                        </SelectedContacts>
                    </Fieldset>

                    <Button type="submit">
                    {loading ? (
                                <img
                                    src={`/loading-${theme}.svg`}
                                    alt="loading"
                                />
                            ) : "Create"}
                    </Button>
                </Form>
            </Inner>
        </Container>
    );
};
