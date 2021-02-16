import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import User from "../models/User";
import UserView from "../views/UserView";
import { encryptPassword, generateToken, comparePasswords, authenticateToken } from "../utils/user";
import * as Yup from "yup";
import crypto from "crypto";
import transporter from "../utils/mailer";

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

    async auth(request: Request, response: Response, next: NextFunction) {
        try {
            const { access_token, user_required } = request.query;

            if (!access_token)
                return response.status(401).json({ error: "The access token is undefined" });

            const userVerified = authenticateToken(access_token.toString());

            if (user_required) {
                request.body.user = userVerified;
                const { id } = request.body.user;

                const userRepository = getRepository(User);
                const user = await userRepository.findOne(id);

                if (!user)
                    return response.status(500).json({ error: "Unexpected error" });

                return response.status(200).json({ user: UserView.render(user) });
            };

            next()
        } catch (err) {
            return response.status(401).json({ error: "Access denied" });
        };
    },

    async login(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({ email });

            if (!user)
                return response.status(400).json({ error: "Email invalid" });

            if (!comparePasswords(password, user.password))
                return response.status(401).json({ error: "Invalid password" });

            return response.status(200).json({
                token: generateToken({ id: user.id }),
                user: UserView.render(user),
            });
        } catch (err) {
            console.log("error on [login] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async forgotPassword(request: Request, response: Response) {
        try {
            const { email } = request.body;

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({ email });

            if (!user)
                return response.status(400).json({ error: "User not found" });

            const resetToken = crypto.randomBytes(20).toString("hex");
            const expireToken = Date.now() + 3600000;

            await userRepository.update(email, { resetToken, expireToken });

            transporter.sendMail({
                to: user.email,
                from: "78e90a5f28-6cbf41@inbox.mailtrap.io",
                subject: "Password Reset",
                html: `
                    <p>
                        You request for password reset, click 
                        <a href="http://localhost:3000/reset/${resetToken}">
                            here
                        </a>
                    </p>`
            });

            return response.status(200).json({ message: "Check your email" });
        } catch (err) {
            console.log("error on [reset password] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async resetPassword(request: Request, response: Response) {
        try {
            const { password, resetToken } = request.body;

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({ resetToken });

            if (!user)
                return response.status(400).json({ error: "Invalid token" });

            if (Date.now() > Number(user.expireToken))
                return response.status(400).json({ error: "Token expired" });

            const { id } = user;
            await userRepository.update(id, {
                password: encryptPassword(password),
                resetToken: undefined,
                expireToken: undefined,
            });

            return response.status(200).json({ message: "Password changed with success!" });
        } catch (err) {
            console.log("error on [new password] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },
};