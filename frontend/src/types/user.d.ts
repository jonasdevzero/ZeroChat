export interface ContactMessagesI {
    id: number;
    sender_id: string;
    message: string;
    posted_at: Date;
};

export interface ContactI {
    id: string;
    username: string;
    image: string;
    messages: ContactMessagesI[];
};

export interface GroupMessagesI {
    group_id: string;
    sender_id: string;
    message: string;
    posted_at: Date
};

export interface GroupUsersI {
    id: string;
    username: string;
    image: string | undefined;
    role: "user" | "admim";
};

export interface GroupI {
    id: string;
    name: string;
    description: string;
    image: string;
    created_at: Date;
    messages: GroupMessagesI[];
    users: GroupUsersI[];
};

export interface UserI {
    id: string;
    name: string;
    username: string;
    email: string;
    picture: string | undefined;
    created_at: Date;
    contacts: ContactI[];
    groups: GroupI[];
};
