import { Group } from "../models";
import { GroupUsersView } from "./";

export default {
    render(group: Group) {
        return {
            id: group.id,
            name: group.name,
            description: group.description,
            created_at: group.created_at,
            last_message: group.lastMessage,
            last_message_sender: group.lastMessageSender,
            last_message_time: group.lastMessageTime,
            users: GroupUsersView.renderUsers(group.users) || [],
            messages: group.messages,
        };
    },

    renderMany(groups: Group[]) {
        return groups.map(group => this.render(group));
    },
};
