interface ISessionUser {
    id: string;
    socketId: string;
    contacts: string[];
};

let users: ISessionUser[] = [];

export default {
    findOne(id: string) {
        let user = users.find(u => u.id === id);

        if (!user)
            user = users.find(u => u.socketId === id)

        return user;
    },

    remove(socketId: string) {
        users = users.filter(u => u.socketId !== socketId);
    },

    create(data: ISessionUser) {
        users.push(data);
    },

    pushNewContact(userSocketId: string, contactId: string) {
        users = users.map(user => {
            if (user.socketId === userSocketId) {
                user.contacts.push(contactId);
            };
            
            return user;
        });
    },

    isOnline(contactId: string) {
        if (this.findOne(contactId)) {
            return true;
        };

        return false;
    },

    getContactsOnline(contacts: string[]) {
        let contactsOnline: string[] = [];

        contacts.forEach(c => {
            if (this.findOne(c))
                contactsOnline.push(c);
        });

        return contactsOnline;
    },
};
