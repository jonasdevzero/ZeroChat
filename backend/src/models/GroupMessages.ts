import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterInsert } from "typeorm";
import Group from "./Group";

@Entity("group_messages")
export default class GroupMessages {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ name: "sender_id", type: "uuid" })
    senderId: string;

    @Column()
    message: string;

    @Column({ name: "posted_at" })
    postedAt: Date;

    @ManyToOne(_ => Group, group => group.messages)
    group: Group;

    @AfterInsert()
    private setPostedAt() {
        this.postedAt = new Date();
    };
};
