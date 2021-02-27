import { Entity, PrimaryGeneratedColumn, Column, AfterInsert, OneToMany } from "typeorm";
import GroupMessages from "./GroupMessages";
import GroupUsers from "./GroupUsers";

@Entity("group")
export default class Group {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column({ name: "created_by", type: "uuid" })
    createdBy: string;

    @Column({ name: "last_message_sender", type: "uuid" })
    lastMessageSender: string;

    @Column({ name: "last_message" })
    lastMessage: string;

    @Column({ name: "last_message_time" })
    lastMessageTime: Date;

    @Column({ name: "created_at" })
    createdAt: Date;

    @Column({ name: "updated_at" })
    updatedAt: Date;

    @OneToMany(_ => GroupMessages, messages => messages.group, {
        cascade: ["update", "remove"],
    })
    messages: GroupMessages[];

    @OneToMany(_ => GroupUsers, users => users.group, {
        cascade: ["update", "remove"],
    })
    users: GroupUsers[];

    @AfterInsert()
    private setCreatedAt() {
        const date = new Date();

        this.createdAt = date;
        this.updatedAt = date; 
    };
};
