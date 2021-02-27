import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterInsert } from "typeorm";
import Contact from "./Contact";

@Entity("contact_messages")
export default class ContactMessages {
    @PrimaryGeneratedColumn("increment")
    id: number;
    
    @Column()
    message: string;

    @Column({ name: "sender_id", type: "uuid" })
    senderId: string;

    @Column({ name: "posted_at" })
    postedAt: Date;

    @ManyToOne(_ => Contact, contact => contact.messages)
    contact: Contact;

    @AfterInsert()
    private setPostedAt() {
        this.postedAt = new Date();
    };
};
