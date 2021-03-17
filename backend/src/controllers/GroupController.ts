import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Group, GroupUsers, User } from "../models";
import { GroupView } from "../views";

export default {
    async index(request: Request, response: Response) {
        try {
            const { id } = request.query;
            const groupRepository = getRepository(Group);

            const groups = await groupRepository
                .createQueryBuilder("groupUsers")
                .orderBy("groupUsers.last_message_time", "DESC")
                .leftJoinAndSelect("groupUsers.users", "users")
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
            const {
                id,
                name,
                description,
                members,
            } = request.body;

            const userRepository = getRepository(User);
            const user = await userRepository.findOne(id);

            if (!user)
                return response.status(400).json({ message: "Invalid id" });

            let image = undefined, image_key = undefined;
            if (request.file) {
                // I'm changed the Express.Multer.File interface adding the location variable as string | undefined;   
                const { location, filename } = request.file;

                image = process.env.STORAGE_TYPE === "s3" ? location : `${process.env.APP_URL}/files/${filename}`;
                image_key = filename;
            };

            const groupRepository = getRepository(Group);
            const group = await groupRepository.create({ name, image: image, description, created_by: id, image_key }).save();

            const groupUsersRepository = getRepository(GroupUsers);
            await groupUsersRepository.create({ user, group, role: "admim" }).save();

            await members?.forEach(async (member_id: string) => {
                const user = await userRepository.findOne(member_id);

                if (user) {
                    const groupUsersRepository = getRepository(GroupUsers);
                    await groupUsersRepository.create({ user, group, role: "user" }).save();
                };
            });

            return response.status(200).json({ group });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error!" });
        };
    },
};
