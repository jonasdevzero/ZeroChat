import { Entity, Column, PrimaryColumn, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { encryptPassword } from "../utils/user";
import Contacts from "./Contacts";

@Entity("user")
export default class User extends BaseEntity {
    @PrimaryColumn("uuid")
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

    @OneToMany(_ => Contacts, contacts => contacts.user_id)
    @JoinColumn({ name: "user_id" })
    contacts: Contacts;

    @BeforeInsert()
    private beforeInsert() {
        const date = new Date();

        this.created_at = date; 
        this.updated_at = date;

        this.id = uuidv4();
        this.password = encryptPassword(this.password);
    };

    @BeforeUpdate()
    private updateDate() {
        this.updated_at = new Date();
    };
};
