export interface ContactMessageI {
    id: number;
    sender_id: string;
    message: string;
    posted_at: Date;
    id_contact: string;
    double_contact_id: string;
};

export interface ContactI {
    id_contact: string;
    id: string;
    username: string;
    image: string;
    messages: ContactMessageI[];
    online: true | false;
    unread_messages: number | null;
    active: true | false;
    blocked: true | false;
};

export interface GroupMessageI {
    id: string;
    group_id: string;
    sender_id: string;
    message: string;
    posted_at: Date
};

export interface GroupUserI {
    id: string;
    username: string;
    unread_messages: number | undefined;
    image: string | undefined;
    role: "user" | "admim";
};

export interface GroupI {
    id: string;
    name: string;
    description: string;
    image: string;
    created_at: Date;
    unread_messages: number | undefined;
    messages: GroupMessageI[];
    users: GroupUserI[];
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
