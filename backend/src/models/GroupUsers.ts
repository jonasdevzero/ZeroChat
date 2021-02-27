import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Group from "./Group";
import User from "./User";

@Entity("group_users")
export default class GroupUsers {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    role: string;

    @ManyToOne(_ => Group, group => group.users)
    group: Group;

    @ManyToOne(_ => User, user => user.groups)
    user: User;
};
