import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, JoinColumn } from "typeorm";
import { User, ContactMessages } from "./";

@Entity("contact")
export default class Contact extends BaseEntity {
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
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(_ => ContactMessages, messages => messages.contact, {
        cascade: ["update", "remove"],
    })
    @JoinColumn({ name: "id_contact" })
    messages: ContactMessages[];
};
