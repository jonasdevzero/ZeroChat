import { ContactI, GroupUserI, UserI } from '../types/user';
import api from './api';
import socket from './socket';

export default {
    async get() {
        let data: { user: UserI, token: string };
        let rooms: string[] = []; // rooms to join -> [userId, ...groups]

        // getting the token and the user without contacts and groups
        await api.post(`/user/auth?user_required=true`).then(response => data = response.data);

        // getting groups by last message
        await api.get(`/group`).then(response => {
            const { groups } = response.data;

            // getting the user unread_messages of each group
            data.user.groups = groups.map(group => {
                group.unread_messages = group.users.find((u: GroupUserI) => u?.id === data.user.id).unread_messages;
                return group;
            });

            rooms = [data.user.id];
            groups.forEach(group => rooms.push(group.id));
        });

        // getting contacts by last message and check the contacts online
        await api.get(`/contact`).then(response => {
            const { contacts } = response.data;

            data.user.contacts = contacts;

            const contactsId: string[] = [];
            contacts.forEach(contact => contactsId.push(contact.id));

            socket.emit("join", { rooms, contacts: contactsId }, (contactsOnline: string[]) => {
                data.user.contacts = data.user.contacts.map((contact: ContactI) => {
                    contact.online = contactsOnline.find(id => id === contact.id) ? true : false;

                    return contact;
                });
            });
        });

        return data;
    },

    async searchUsers({ username }) {
        const response = await api.get(`/user?username=${username}`);

        return response.data.contacts;
    },
};
