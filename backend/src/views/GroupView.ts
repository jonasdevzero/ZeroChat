import { Group } from "../models";
import { GroupUsersView } from "./";

export default {
    render(group: Group) {
        return {
            id: group.id,
            name: group.name,
            image: group.image,
            description: group.description,
            created_at: group.created_at,
            users: GroupUsersView.renderUsers(group.users) || [],
            messages: group.messages,
        };
    },

    renderMany(groups: Group[]) {
        return groups.map(group => this.render(group));
    },
};
