import { GroupMessages } from '../models';

export default {
    render(message: GroupMessages) {
        return {
            id: message.id,
            message: message.message,
            sender_id: message.sender_id,
            group_id: message.group_id,
            sender: {
                username: message.sender.username,
                image: message.sender.picture,
            },
            posted_at: message.posted_at,
        }
    },

    renderMany(messages: GroupMessages[]) {
        return messages.map(message => this.render(message))
    },
};
