import { Dispatch, SetStateAction } from "react";
import api from "../services/api";
import {
    ContactI,
    GroupI,
    GroupUserI,
    UserI,
} from "../types/user";
import {
    SetUserMasterI,
    SetUserMasterUpdateI,
    UpdateUserI,
    ContactUpdateSetI,
    ContactUpdateI,
    GroupUpdateI,
    ContactPushMessageI,
    GroupPushMessageI,
} from "../types/useSetUserMaster";

export default function useSetUserMaster(user: UserI, setUser: Dispatch<SetStateAction<UserI>>) {
    function orderRoomsByLastMessage<T extends any[]>(arr: T, from: number, to: number) {
        arr?.splice(to, 0, arr?.splice(from, 1)[0]);
        return arr;
    };

    function setUserMasterUpdate({ dispatch, where, change, data }: SetUserMasterUpdateI) {
        let position: number;

        setUser({
            ...user,
            contacts: dispatch === "CONTACTS" ? user?.contacts?.map((contact, index) => {
                if (Array.isArray(where) ? where.includes(contact.id) : where === contact.id) {
                    position = index;
                    switch (change) {
                        case "NEW_MESSAGE":
                            const { message, currentContactId } = data;
                            const { sender_id, contact: { id: receiver_id, unread_messages } } = message;

                            contact.messages?.push(message);
                            contact.active = true;

                            if (user.id === receiver_id) {
                                if (currentContactId === sender_id) {
                                    api.put(`/contact/${currentContactId}?&unread_messages=true`);
                                    contact.unread_messages = undefined;
                                } else {
                                    contact.unread_messages = unread_messages;
                                };
                            };
                            break;
                        case "UPDATE":
                            const set: ContactUpdateSetI = data.set;
                            const keys = Object.keys(set);

                            keys.forEach(key => contact[key] = set[key]);
                            break;
                    };
                };
                return contact;
            }) : user?.contacts,
            groups: dispatch === "GROUPS" ? user?.groups?.map((group, index) => {
                if (where === group.id) {
                    position = index;
                    switch (change) {
                        case "NEW_MESSAGE":
                            const { message, currentGroupId } = data;
                            const { group_id, users } = message;

                            group.messages?.push(message);

                            if (currentGroupId === group_id) {
                                api.put(`/group/${currentGroupId}?unread_messages=true`);
                                group.unread_messages = undefined;
                            } else {
                                group.unread_messages = users.find((u: GroupUserI) => u.id === user?.id).unread_messages;
                            };
                            break;
                        case "UPDATE":
                            const set: ContactUpdateSetI = data.set;
                            const keys = Object.keys(set);

                            keys.forEach(key => group[key] = set[key]);
                            break;
                    };
                };
                return group;
            }) : user?.groups,
        });

        if (change === "NEW_MESSAGE" && position > 0) {
            setUser({
                ...user,
                contacts: dispatch === "CONTACTS" ? orderRoomsByLastMessage(user.contacts, position, 0) : user.contacts,
                groups: dispatch === "GROUPS" ? orderRoomsByLastMessage(user.groups, position, 0) : user.groups,
            });
        };
    };

    return {
        async update(set: UpdateUserI) {
            setUser({ ...user, ...set });
        },
        contacts: {
            async update({ where, set }: ContactUpdateI) {
                setUserMasterUpdate({ dispatch: "CONTACTS", where, change: "UPDATE", data: { set } })
            },
            async push(contact: ContactI) {
                const contacts = [contact];
                user.contacts.forEach(c => contacts.push(c));
                setUser({ ...user, contacts });
            },
            async pushMessage({ where, message, currentContactId }: ContactPushMessageI) {
                setUserMasterUpdate({ dispatch: "CONTACTS", where, change: "NEW_MESSAGE", data: { message, currentContactId } });
            },
        },
        groups: {
            async update({ where, set }: GroupUpdateI) {
                setUserMasterUpdate({ dispatch: "GROUPS", where, change: "UPDATE", data: { set } });
            },
            async push(group: GroupI) {
                const groups = [group];
                user.groups.forEach(g => groups.push(g));
                setUser({ ...user, groups });
            },
            async pushMessage({ where, message, currentGroupId }: GroupPushMessageI) {
                setUserMasterUpdate({ dispatch: "GROUPS", where, change: "NEW_MESSAGE", data: { message, currentGroupId } });
            },
        },
    } as SetUserMasterI;
};
