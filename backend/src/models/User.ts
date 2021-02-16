import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("user")
export default class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

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
    socketId: string;
};
