import { Contact } from "../models";

export default {
    render(contact: Contact) {
        return {
            id: contact.contactId,
            username: contact.contactUsername,
            image: contact.contactImage,
            last_message: contact.lastMessage,
            last_message_sender: contact.lastMessageSender,
            last_message_time: contact.lastMessageTime,
            messages: contact.messages,
        };
    },

    renderMany(contacts: Contact[]) {
        return contacts.map(contact => this.render(contact));
    },
};
