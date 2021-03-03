import { Contact } from "../models";

export default {
    render(contact: Contact) {
        return {
            id_contact: contact.id,
            id: contact.contact_id,
            username: contact.contact_username,
            image: contact.contact_image,
            messages: contact.messages,
        };
    },

    renderMany(contacts: Contact[]) {
        return contacts.map(contact => this.render(contact));
    },
};
