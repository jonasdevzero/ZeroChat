import { Contact } from "../models";

export default {
    render(contact: Contact) {
        return {
            id: contact.contact_id,
            username: contact.contact_username,
            image: contact.contact_image,
            messages: contact.messages,
            unread_messages: contact.unread_messages,
        };
    },

    renderMany(contacts: Contact[]) {
        return contacts.map(contact => this.render(contact));
    },
};
