import { ContactMessageI, GroupMessageI } from "./user";

interface UpdateUserI {
    name?: string;
    username?: string;
    picture?: string;
    email?: string;
};

export interface ContactPushMessageI {
    where: string | string[];
    message: any;
    currentContactId: string;
};

export interface GroupPushMessageI {
    where: string;
    message: any;
    currentGroupId: string;
};

export interface ContactUpdateSetI {
    username?: string;
    image?: string;
    online?: boolean;
    messages?: ContactMessageI[];
    unread_messages?: number | undefined;
};

export interface ContactUpdateI {
    where: string;
    set: ContactUpdateSetI;
};

export interface GroupUpdateSetI {
    name?: string;
    image?: string;
    description?: string;
    messages?: GroupMessageI[];
    unread_messages?: number | undefined;
};

export interface GroupUpdateI {
    where: string;
    set: GroupUpdateSetI;
};

export interface SetUserMasterUpdateI {
    dispatch: "CONTACTS" | "GROUPS";
    where: string | string[];
    change: "NEW_MESSAGE" | "UPDATE";
    data: { [key: string]: any };
};

export interface SetUserMasterI {
    update({ name, username, picture }: UpdateUserI): Promise<void>;
    contacts: {
        update({ where, set }: ContactUpdateI): Promise<void>;
        push(contact: ContactI): Promise<void>;
        pushMessage({ where, message, currentContactId }: ContactPushMessageI): Promise<void>;
    },
    groups: {
        update({ where, set }: GroupUpdateI): Promise<void>;
        push(group: GroupI): Promise<void>;
        pushMessage({ where, message, currentGrouptId }: GroupPushMessageI): Promise<void>;
    }
};
