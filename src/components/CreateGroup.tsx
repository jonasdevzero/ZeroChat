import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { UserI, ContactI, GroupI } from "../types/user";
import Fuse from "fuse.js";
import { api, socket } from "../services";
import { SetUserMasterI } from "../types/useSetUserMaster";

import {
    Container,
    Header,
    Inner,
    Form,
} from "../styles/components/BaseContainer";
import {
    InputContainer,
    SearchOrCloseButton,
    Wrapper,
    SearchInput,
    SearchInputWrapper,
    FilteredContacts,
    SelectedContacts,
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
    theme: "light" | "dark";
};

export default function CreateGroup({ user, setUserMaster, setCurrentRoomType, setCurrentRoom, setCurrentContainer, theme }: CreateGroupI) {
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
                socket.emit("group", { event: "join", groupId: group.id }, () => {
                    setUserMaster.groups.push(group).then(() => {
                        setCurrentRoomType("group");
                        setCurrentRoom(group);
                        setCurrentContainer("messages");
                    });
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
                    <Form.Fieldset>
                        <Form.Legend>Group Data</Form.Legend>

                        <Form.Wrapper.Input className="row">
                            <Form.Wrapper.Image>
                                {!image ? (
                                    <>
                                        <Form.Image.Label htmlFor="image">
                                            <CloudUploadIcon fontSize="large" />
                                        </Form.Image.Label>

                                        <Form.Image.Input id="image" type="file" onChange={handleSelectImage} />
                                    </>
                                ) : (
                                    <Form.Image.Remove type="button" onClick={() => removeSelectedImage()}>
                                        <CloseIcon fontSize="large" />
                                    </Form.Image.Remove>
                                )}

                                <Avatar src={imagePreview} />
                            </Form.Wrapper.Image>

                            <Wrapper>
                                <Form.Label>
                                    Name
                                </Form.Label>

                                <Form.Input type="text" required value={name} onChange={e => setName(e.target.value)} />
                            </Wrapper>
                        </Form.Wrapper.Input>

                        <Form.Wrapper.Input>
                            <Form.Label>
                                description
                            </Form.Label>

                            <Form.TextArea value={description} onChange={e => setDescription(e.target.value)} />
                        </Form.Wrapper.Input>
                    </Form.Fieldset>

                    <Form.Fieldset>
                        <Form.Legend>Group Members</Form.Legend>

                        <SearchInputWrapper>

                            <InputContainer>
                                <SearchInput
                                    type="text"
                                    placeholder="Search contacts"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />

                                <SearchOrCloseButton type="button" onClick={() => search.length > 0 ? setSearch("") : null}>
                                    {search.length > 0 ? (<CloseIcon />) : (<SearchIcon />)}
                                </SearchOrCloseButton>
                            </InputContainer>

                            {searchResult?.length > 0 ? (
                                <FilteredContacts>
                                    {searchResult.map((contact, i) => {
                                        return (
                                            <FilteredContacts.Contact key={i} onClick={() => selectContact(contact)}>
                                                <Avatar src={contact?.image} />

                                                <p>{contact.username}</p>
                                            </FilteredContacts.Contact>
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
                                            <SelectedContacts.Contact key={i}>
                                                <Avatar src={selectedContact.username} />

                                                <span>{selectedContact.username}</span>

                                                <SelectedContacts.Contact.Remove type="button" onClick={() => removeSelectedContact(selectedContact)}>
                                                    <CloseIcon />
                                                </SelectedContacts.Contact.Remove>
                                            </SelectedContacts.Contact>
                                        );
                                    })}
                                </>
                            ) : (
                                <SelectedContacts.WithoutContacts>
                                    <strong>Select contacts to your group</strong>
                                </SelectedContacts.WithoutContacts>
                            )}
                        </SelectedContacts>
                    </Form.Fieldset>

                    <Form.Button type="submit">
                        {loading ? (<img src={`/loading-${theme === "dark" ? "light" : "dark"}.svg`} alt="loading" />) : "Create"}
                    </Form.Button>
                </Form>
            </Inner>
        </Container>
    );
};
