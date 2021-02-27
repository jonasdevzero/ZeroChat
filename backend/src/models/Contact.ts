import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import ContactMessages from "./ContactMessages";
import User from "./User";

@Entity("contact")
export default class Contact {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "contact_id", type: "uuid" })
    contactId: string;

    @Column({ name: "contact_username" })
    contactUsername: string;

    @Column({ name: "contact_image" })
    contactImage: string;

    @Column({ name: "last_message" })
    lastMessage: string;

    @Column({ name: "last_message_sender", type: "uuid" })
    lastMessageSender: string;

    @Column({ name: "last_message_time" })
    lastMessageTime: Date;

    @ManyToOne(_ => User, user => user.contacts)
    user: User;

    @OneToMany(_ => ContactMessages, messages => messages.contact, {
        cascade: ["update", "remove"],
    })
    messages: ContactMessages[];
};
