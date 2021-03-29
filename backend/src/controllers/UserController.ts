import { Request, Response, NextFunction } from "express";
import { getRepository, ILike, Not } from "typeorm";
import User from "../models/User";
import UserView from "../views/UserView";
import { encryptPassword, generateToken, comparePasswords, authenticateToken, removePicture } from "../utils/user";
import * as Yup from "yup";
import crypto from "crypto";
import transporter from "../config/mailer";

export default {
    async index(request: Request, response: Response) {
        try {
            const userRepository = getRepository(User);

            const { username } = request.query;
            let users: User[] = [];

            if (username) {
                users = await userRepository.find({ where: { username: ILike(`%${username}%`) } });
            } else {
                users = await userRepository.find();
            };
            return response.status(200).json({ users: UserView.renderMany(users) });
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
            const { name, username, email, password, confirmPassword } = request.body;

            if (confirmPassword !== password)
                return response.status(400).json({
                    message: "Passwords  are diffrent",
                    fields: ["password"],
                });

            const data = { name, username, email, password };

            const userRepository = getRepository(User);

            const existsUser = await userRepository.findOne({ email });
            const existsUsername = await userRepository.findOne({ username });

            if (existsUser)
                return response.status(400).json({
                    message: "Email already registred",
                    fields: ["email"]
                });
            if (existsUsername)
                return response.status(400).json({
                    message: "Username is already in use",
                    fields: ["username"]
                });

            const schema = Yup.object().shape({
                name: Yup.string().required(),
                username: Yup.string().min(1).required(),
                email: Yup.string().trim().lowercase().required(),
                password: Yup.string().min(6).required(),
            });

            await schema.validate(data, {
                abortEarly: false,
            }).catch(err => response.status(400).json({
                message: err.message,
                fields: err.inner.map((field: { path: string }) => field.path),
            }));

            const user = await userRepository.create(data).save();

            return response.status(201).json({
                token: generateToken({ id: user.id })
            });
        } catch (err) {
            console.log("error on [create] {user} -> ", err);
            return response.status(500).json({ message: "Internal server error" });
        };
    },

    async update(request: Request, response: Response) {
        try {
            const id = response.locals.user.id; // from auth route
            const { update_email, without_image } = request.query;
            const { name, username, email, password } = request.body;

            const userRepository = getRepository(User);

            const result = await Promise.all([
                userRepository.findOne(id),
                update_email === "true" ? userRepository.findOne({ where: { email, id: Not(id) } })
                    : userRepository.findOne({ where: { username, id: Not(id) } }),
            ]);

            const user = result[0];

            if (!user)
                return response.status(400).json({ message: "Incorrect Id" });

            if (update_email === "true") {
                const existsEmail = result[1];
                if (existsEmail)
                    return response.status(400).json({ message: "This email is already registred" });

                if (!comparePasswords(password, user.password))
                    return response.status(401).json({ message: "Incorrect password" });

                await userRepository.update(id, { email });

                return response.status(200).json({ email });
            };

            const existsUsername = result[1];

            if (existsUsername)
                return response.status(400).json({ message: "Username already in use" });

            let picture: string | undefined = user.picture;
            if (request.file) {
                const { filename } = request.file;
                picture = `${process.env.STORAGE_TYPE === "s3" ? process.env.S3_BASE_URL : "http://localhost:3001/files"}/${filename}`;

                if (user.picture) { // Removing the old image
                    removePicture(user.picture);
                };
            } else if (!request.file && without_image === "true") {
                picture = undefined;

                if (user.picture) { // Removing the old image
                    removePicture(user.picture);
                };
            };

            await userRepository.update(id, { name, username, picture });
            const updatedUser = await userRepository.findOne(id);

            if (!updatedUser)
                return response.status(500).json({ error: "Unexpected error" });

            return response.status(200).json({ user: UserView.render(updatedUser) });
        } catch (err) {
            console.log("error on [update] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async delete(request: Request, response: Response) {
        try {
            const id = response.locals.user.id; // from auth route
            const { password } = request.body;

            const userRepository = getRepository(User);

            const user = await userRepository.findOne(id);

            if (!user)
                return response.status(404).json({ message: "User not found" });

            if (!comparePasswords(password, user.password))
                return response.status(400).json({ message: "Invalid password" });

            await userRepository.delete(id);

            return response.status(200).json({ message: "ok" });
        } catch (err) {
            console.log("error on [delete] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async auth(request: Request, response: Response, next: NextFunction) {
        try {
            const { user_required, signin_auth } = request.query;

            const bearer = request.headers["authorization"]?.split(" ") || [];
            const token = bearer[1];

            if (!token)
                return response.status(401).json({ message: "The access token is undefined" });

            const userVerified = authenticateToken(token);
            response.locals.user = userVerified;

            if (user_required === "true") {
                const { id } = response.locals.user;

                try {
                    const userRepository = getRepository(User);
                    const user = await userRepository.findOne(id);

                    if (!user)
                        return response.status(500).json({ message: "Unexpected error" });

                    return response.status(200).json({
                        token: generateToken({ id: user.id }),
                        user: UserView.render(user),
                    });
                } catch (err) {
                    console.log(err)
                };
            } else if (signin_auth === "true") {
                return response.status(200).json({ message: "ok" });
            };

            next()
        } catch (err) {
            return response.status(401).json({ message: "Access denied" });
        };
    },

    async login(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({ email });

            if (!user)
                return response.status(400).json({
                    message: "Invalid email",
                    fields: ["email"],
                });

            if (!comparePasswords(password, user.password))
                return response.status(401).json({
                    message: "Invalid password",
                    fields: ["password"],
                });

            return response.status(200).json({
                token: generateToken({ id: user.id }),
            });
        } catch (err) {
            console.log("error on [login] {user} -> ", err);
            return response.status(500).json({ message: "Internal server error" });
        };
    },

    async forgotPassword(request: Request, response: Response) {
        try {
            const { email } = request.body;

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({ email });

            if (!user)
                return response.status(400).json({ message: "User not found" });

            const resetToken = crypto.randomBytes(20).toString("hex");
            const expireToken = new Date();
            expireToken.setHours(expireToken.getHours() + 1);

            const { id } = user;
            await userRepository.update(id, { resetToken, expireToken });

            transporter.sendMail({
                from: "Dev Zero <devzerotest@gmail.com>",
                to: email,
                subject: "Password Reset",
                html: `
                    <h1>Click <a href="http://localhost:3000/resetPassword/${resetToken}">here</a> to reset your password</h1>               
                `,
            });

            return response.status(200).json({ message: "Check your email" });
        } catch (err) {
            console.log("error on [reset password] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async resetPassword(request: Request, response: Response) {
        try {
            const { password, confirmPassword, resetToken } = request.body;

            if (password !== confirmPassword)
                return response.status(400).json({ message: "Passwords  are diffrent" });

            const userRepository = getRepository(User);
            const user = await userRepository.findOne({ where: { resetToken } });

            if (!user)
                return response.status(400).json({ message: "Invalid token" });

            const now = new Date();
            if (now > user.expireToken)
                return response.status(400).json({ message: "Token expired" });

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