import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../models/User";
import UserView from "../views/UserView";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as Yup from "yup";

const secret = process.env.USER_SECRET || "";

function encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

function generateToken(params: object) {
    return jwt.sign(params, secret);
};

function comparePasswords(password: string, secretPassword: string) {
    return bcrypt.compareSync(password, secretPassword);
};

export default {
    async index(request: Request, response: Response) {
        try {
            const userRepository = getRepository(User);

            const users = await userRepository.find();

            return response.status(200).json({ user: UserView.renderMany(users) });
        } catch (err) {
            console.log("error on [index] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async show(request: Request, response: Response) {
        try {
            const { username } = request.params;

            const userRepository = getRepository(User);

            const user = await userRepository.findOne({ username });

            if (!user)
                return response.status(404).json({ error: "User not found" });

            return response.status(200).json({ user: UserView.render(user) });
        } catch (err) {
            console.log("error on [show] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async create(request: Request, response: Response) {
        try {
            const { name, username, email, password } = request.body;
            const data = { name, username, email, password };

            const userRepository = getRepository(User);

            const existsUser = await userRepository.findOne({ email });
            const existsUsername = await userRepository.findOne({ username });

            if (existsUser || existsUsername)
                return response.status(409).json({ error: "User or username already exists" });

            const schema = Yup.object().shape({
                name: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),
            });

            await schema.validate(data, {
                abortEarly: false,
            }).catch(err => response.status(400).json({
                message: err.message,
                fields: err.inner.map((field: { path: string }) => field.path),
            }));

            data.password = encryptPassword(password);

            const user = userRepository.create(data);
            await userRepository.save(user);

            return response.status(201).json({
                token: generateToken({ id: user.id }),
                user: UserView.render(user),
            });
        } catch (err) {
            console.log("error on [create] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async update(request: Request, response: Response) {
        try {
            const id = request.params.id;
            const { name, username, picture } = request.body;

            const userRepository = getRepository(User);

            const existsUsername = await userRepository.findOne({ username });

            if (existsUsername)
                return response.status(400).json({ error: "Username already exists" });

            await userRepository.update(id, { name, username, picture });
            const user = await userRepository.findOne(id);

            if (!user)
                return response.status(500).json({ error: "Unexpected error" });

            return response.status(200).json({ user: UserView.render(user) });
        } catch (err) {
            console.log("error on [update] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async delete(request: Request, response: Response) {
        try {
            const id = request.params.id;
            const { password } = request.body;

            const userRepository = getRepository(User);

            const user = await userRepository.findOne(id);

            if (!user)
                return response.status(404).json({ error: "User not found" });

            if (!comparePasswords(password, user.password))
                return response.status(400).json({ error: "Invalid password" });

            await userRepository.delete(id);

            return response.status(200).json({ message: "ok" });
        } catch (err) {
            console.log("error on [delete] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async auth(request: Request, response: Response) {
        try {
            //...
        } catch (err) {
            console.log("error on [auth] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async login(request: Request, response: Response) {
        try {
            //...
        } catch (err) {
            console.log("error on [login] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async resetPassword(request: Request, response: Response) {
        try {
            //...
        } catch (err) {
            console.log("error on [reset password] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async newPassword(request: Request, response: Response) {
        try {
            //...
        } catch (err) {
            console.log("error on [new password] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },
};