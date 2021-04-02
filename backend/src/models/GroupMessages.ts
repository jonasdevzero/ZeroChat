import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { User, Group } from ".";

@Entity("group_messages")
export default class GroupMessages extends BaseEntity {
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
    
    @ManyToOne(_ => User, user => user.group_messages_sent)
    @JoinColumn({ name: "sender_id" })
    sender: User;

    @ManyToOne(_ => Group, group => group.messages)
    @JoinColumn({ name: "group_id" })
    group: Group;
};
