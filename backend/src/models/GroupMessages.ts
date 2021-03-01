import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, JoinColumn } from "typeorm";
import Group from "./Group";

@Entity("group_messages")
export default class GroupMessages {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column("uuid")
    group_id: string;

    @Column("uuid")
    sender_id: string;

    @Column()
    message: string;

    @Column()
    posted_at: Date;

    @ManyToOne(_ => Group, group => group.messages)
    @JoinColumn({ name: "group_id" })
    group: Group;

    @BeforeInsert()
    private setPostedAt() {
        this.posted_at = new Date();
    };
};
