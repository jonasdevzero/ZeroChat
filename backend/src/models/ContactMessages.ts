import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterInsert, JoinColumn } from "typeorm";
import Contact from "./Contact";

@Entity("contact_messages")
export default class ContactMessages {
    @PrimaryGeneratedColumn("increment")
    id: number;
    
    @Column()
    message: string;

    @Column("uuid")
    sender_id: string;

    @Column()
    posted_at: Date;

    @ManyToOne(_ => Contact, contact => contact.messages)
    @JoinColumn({ name: "id_contact" })
    contact: Contact;

    @AfterInsert()
    private setPostedAt() {
        this.posted_at = new Date();
    };
};
