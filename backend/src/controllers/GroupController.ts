import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Group, GroupUsers, GroupMessages } from "../models";
import { GroupUsersView, GroupView } from "../views";
import * as Yup from "yup";

export default {
    async index(request: Request, response: Response) {
        try {
            const id = response.locals.user.id; // from auth route
            const groupRepository = getRepository(Group);

            const groups = await groupRepository
                .createQueryBuilder("group")
                .orderBy("group.last_message_time", "DESC")
                .leftJoinAndSelect("group.users", "users")
                .leftJoinAndSelect("users.user", "user")
                .where("user.id = :id", { id })
                .getMany();

            return response.status(200).json({ groups: GroupView.renderMany(groups) });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error" })
        };
    },

    async create(request: Request, response: Response) {
        try {
            const id = response.locals.user.id;
            const { name, description, members } = request.body;
            const data = { name, description };

            const schema = Yup.object().shape({
                name: Yup.string().required(),
                description: Yup.string().required(),
            });
            await schema.validate(data, { abortEarly: false })
                .catch(err => response.status(400).json({
                    message: err.message,
                    fields: err.inner.map((field: { path: string }) => field.path),
                }));

            let image = undefined;
            if (request.file) {  
                const { filename } = request.file;
                image = `${process.env.STORAGE_TYPE === "s3" ? process.env.S3_BASE_URL : "http://localhost:3001/files"}/${filename}`;
            };

            const now = new Date();

            const groupRepository = getRepository(Group);
            const group = await groupRepository.create({ name, image, description, created_by: id, last_message_time: now }).save();

            const groupUsersRepository = getRepository(GroupUsers);
            const createUsers = [groupUsersRepository.create({ user: { id }, group, role: "admim" }).save()];

            if (members) {
                const membersArray: string[] = Array.isArray(members) ? members : [members];
                membersArray.forEach(id => createUsers.push(groupUsersRepository.create({ user: { id }, group, role: "user" }).save()))
            };

            await Promise.all(createUsers);

            return response.status(200).json({ group: GroupView.render(group) });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error!" });
        };
    },

    async update(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const user_id = response.locals.user.id; // from auth route
            const { unread_messages } = request.query;

            const groupUsersRepository = getRepository(GroupUsers);
            const groupUser = await groupUsersRepository.findOne({ where: { user: { id: user_id }, group: { id } } })

            if (!groupUser)
                return response.status(400).json({ message: "Incorrect group Id" });

            if (unread_messages === "true") {
                await groupUsersRepository.update(groupUser, { unread_messages: undefined });
                return response.status(200).json({ message: "ok" });
            };
        } catch (err) {
            console.log(err);
        };
    },

    async indexMessages(request: Request, response: Response) {
        try {
            const group_id = request.query.group_id?.toString();

            const groupMessagesRepository = getRepository(GroupMessages);
            const messages = await groupMessagesRepository.find({ group_id });

            return response.status(200).json({ messages });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal Server Error" });
        };
    },

    async createMessage(request: Request, response: Response) {
        try {
            const sender_id = response.locals.user.id; // from auth route
            const { group_id, message } = request.body;

            const groupUsersRepository = getRepository(GroupUsers);
            const groupMessagesRepository = getRepository(GroupMessages);

            const posted_at = new Date();

            const result = await Promise.all([
                groupMessagesRepository.create({ sender_id, group_id, message, posted_at }).save(),
                groupUsersRepository.find({ where: { group: { id: group_id } }, relations: ["user"] }),
            ]);
            const messageData = result[0];
            const groupUsers = result[1];

            if (!groupUsers) // every group has at least one person 
                return response.status(400).json({ message: "Group Id incorrect" });

            await Promise.all(groupUsers.map(groupUser => {
                if (groupUser.user.id === sender_id) return;

                const id = groupUser.id;
                const unread_messages = groupUser.unread_messages ? groupUser.unread_messages += 1 : 1;
                return groupUsersRepository.update(id, { unread_messages });
            }));

            const groupUsersUpdated = await groupUsersRepository.find({ where: { group: { id: group_id } }, relations: ["user"] });

            const newMessage = {
                ...messageData,
                users: GroupUsersView.renderUsers(groupUsersUpdated),
            };

            return response.status(201).json({ message: newMessage });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal Server Error" });
        };
    },
};
