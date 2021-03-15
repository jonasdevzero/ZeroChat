import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn } from "typeorm";
import Contact from "./Contact";

@Entity("contact_messages")
export default class ContactMessages extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column("uuid")
    double_contact_id: string;
    
    @Column()
    message: string;

    @Column("uuid")
    sender_id: string;

    @Column()
    posted_at: Date;

    @ManyToOne(_ => Contact, contact => contact.messages)
    @JoinColumn({ name: "id_contact" })
    contact: Contact;
};
