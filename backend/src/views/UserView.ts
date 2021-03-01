import { User } from "../models";
import { ContactView, GroupUsersView } from "./";

export default {
    render(user: User) {
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            picture: user.picture,
            created_at: user.created_at,
            contacts: user.contacts ? ContactView.renderMany(user.contacts) : [],
            groups: user.groups ? GroupUsersView.renderGroups(user.groups) : [],
        };
    },

    renderMany(users: User[]) {
        return users.map(user => this.render(user));
    },
};