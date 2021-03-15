import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn, OneToMany, BeforeInsert } from "typeorm";
import { User, ContactMessages } from "./";

@Entity("contact")
export default class Contact extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid")
    contact_id: string;

    @Column()
    unread_messages: number;

    @Column()
    last_message_time: Date;

    @Column()
    active: boolean;

    @Column()
    blocked: boolean;

    @ManyToOne(_ => User, user => user.self_contact)
    @JoinColumn({ name: "contact_id" })
    contact: User;

    @ManyToOne(_ => User, user => user.contacts)
    @JoinColumn({ name: "user_id" })
    user: User;

    @OneToMany(_ => ContactMessages, messages => messages.contact, {
        cascade: ["update", "remove"],
    })
    @JoinColumn({ name: "id_contact" })
    messages: ContactMessages[];

    @BeforeInsert() 
    private setBlocked() {
        this.blocked = false;
    };
};
