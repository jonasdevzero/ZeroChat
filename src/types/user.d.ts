export interface ContactMessage {
    id: number;
    text: string;
    medias: [];
    sender_id: string;
    created_at: Date;
    bidirectional_id: string;

    type?: string;
    date?: string;
};

export interface Contact {
    id: string;
    username: string;
    picture: string;
    messages: ContactMessage[];
    unread_messages: number | undefined;
    blocked: boolean;
    you_blocked: boolean;
    online: boolean;
    loaded_messages: boolean;
};

export interface GroupMessage {
    id: string;
    text: string;
    created_at: Date;
    sender: {
        id: string;
        username: string;
        picture: string | null;
    };
};

export interface GroupUser {
    id: number;
    role: "user" | "admim";
    user: {
        id: string;
        username: string;
        picture: string | null;
    };
};

export interface Group {
    id: string;
    name: string;
    picture: string | null;
    description: string;
    created_at: Date;
    unread_messages: number;
    role: string;
    users: GroupUser[];
    messages: GroupMessage[];
    loaded_messages: boolean;
};

export interface Invite {
    id: string;
    created_at: Date;
    sender: {
        id: string;
        username: string;
        picture: string | null;
    };
};

export interface Notification {
    id: string;
    text: string;
    image: string;
    type: string;
    viewed: boolean;
    created_at: Date;
};

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    picture: string | null;
    notifications: Notification[];
    invitations: Invitation[];
    contacts: Contact[];
    groups: Group[];
};
