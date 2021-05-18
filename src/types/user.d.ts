export interface ContactMessageI {
    id: number;
    text: string;
    medias: [];
    sender_id: string;
    created_at: Date;
    bidirectional_id: string;

    type?: string;
    date?: string;
};

export interface ContactI {
    id: string;
    username: string;
    picture: string;
    messages: ContactMessageI[];
    unread_messages: number | undefined;
    blocked: boolean;
    you_blocked: boolean;
    online: boolean;
};

export interface GroupMessageI {
    id: string;
    text: string;
    created_at: Date;
    sender: {
        id: string;
        username: string;
        picture: string | null;
    };
};

export interface GroupUserI {
    id: number;
    role: "user" | "admim";
    user: {
        id: string;
        username: string;
        picture: string | null;
    };
};

export interface GroupI {
    id: string;
    name: string;
    picture: string | null;
    description: string;
    created_at: Date;
    unread_messages: number;
    role: string;
    users: GroupUserI[];
    messages: GroupMessageI[]
};

export interface InvitationI {
    id: string;
    created_at: Date;
    sender: {
        id: string;
        username: string;
        picture: string | null;
    };
};

export interface NotificationI {
    id: string;
    text: string;
    type: string;
    created_at: Date;
};

export interface UserI {
    id: string;
    name: string;
    username: string;
    email: string;
    picture: string | null;
    notifiactions: NotificationI[];
    invitations: InvitationI[];
    contacts: ContactI[];
    groups: GroupI[];
};
