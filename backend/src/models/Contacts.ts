import { Entity, PrimaryColumn, Column, BaseEntity, AfterUpdate, ManyToOne, JoinColumn } from "typeorm";
import User from "./User";

@Entity("contacts")
export default class Contacts extends BaseEntity {
    @PrimaryColumn("uuid")
    id: string;

    @Column("uuid")
    user_id: string;

    @Column("uuid")
    contact_id: string;

    @Column()
    contact_username: string;

    @Column()
    contact_image: string;

    @Column("uuid")
    last_message_sender: string;

    @Column()
    last_message: string;

    @Column()
    last_message_time: Date;

    @ManyToOne(_ => User, user => user.id)
    @JoinColumn({ name: "user_id" })
    user: User;

    @AfterUpdate()
    private updateTime() {
        this.last_message_time = new Date();
    };
};
