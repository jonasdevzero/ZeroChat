import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany, JoinColumn } from 'typeorm';
import { encryptPassword } from "../utils/user";
import { Contact, GroupUsers } from './';

@Entity("user")
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    picture: string;

    @Column()
    resetToken: string;

    @Column()
    expireToken: Date;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @OneToMany(_ => Contact, contact => contact.user, {
        cascade: ["update", "remove"],
    })
    @JoinColumn({ name: "user_id" })
    contacts: Contact[];

    @OneToMany(_ => GroupUsers, groups => groups.user, {
        cascade: ["update", "remove"],
    })
    @JoinColumn({ name: "user_id" })
    groups: GroupUsers[];

    @OneToMany(_ => Contact, contact => contact.contact, {
        cascade: ["update", "remove"],
    })
    @JoinColumn({ name: "contact_id" })
    self_contact: Contact[];

    @BeforeInsert()
    private beforeInsert() {
        const date = new Date();

        this.created_at = date; 
        this.updated_at = date;

        this.password = encryptPassword(this.password);
    };

    @BeforeUpdate()
    private updateDate() {
        this.updated_at = new Date();
    };
};
