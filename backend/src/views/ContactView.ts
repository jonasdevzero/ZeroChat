import { Contact } from "../models";

export default {
    render(contact: Contact) {
        return {
            id: contact.contact.id,
            username: contact.contact.username,
            image: contact.contact.picture,
            messages: contact.messages,
            unread_messages: contact.unread_messages,
            active: contact.active,
            blocked: contact.blocked,
        };
    },

    renderMany(contacts: Contact[]) {
        return contacts.map(contact => this.render(contact));
    },
};
