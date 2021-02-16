import User from "../models/User";

export default {
    render(user: User) {
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            picture: user.picture,
        };
    },

    renderMany(users: User[]) {
        return users.map(user => this.render(user));
    },
};