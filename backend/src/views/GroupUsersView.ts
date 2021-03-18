import { GroupUsers } from "../models";
import { GroupView } from "./";

export default {
    renderUsers(users: GroupUsers[]) {
        return users?.map(groupUser => {
            const user = groupUser.user

           return {
               id: user.id,
               username: user.username,
               image: user.picture,
               role: groupUser.role,
           };
        });
    },

    renderGroups(groups: GroupUsers[]) {
        return groups?.map(groupData => {
            const group = groupData.group;

            return GroupView.render(group);
        });
    },
};