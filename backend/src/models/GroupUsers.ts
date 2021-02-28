import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Group, User } from "./";

@Entity("group_users")
export default class GroupUsers extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    role: string;

    @ManyToOne(_ => Group, group => group.users)
    @JoinColumn({ name: "group_id" })
    group: Group;

    @ManyToOne(_ => User, user => user.groups)
    @JoinColumn({ name: "user_id" })
    user: User;
};
