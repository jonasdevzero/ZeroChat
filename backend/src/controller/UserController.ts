import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../models/User";
import UserView from "../views/UserView";

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
            //...
        } catch (err) {
            console.log("error on [create] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async update(request: Request, response: Response) {
        try {
            //...
        } catch (err) {
            console.log("error on [update] {user} -> ", err);
            return response.status(500).json({ error: "Internal server error" });
        };
    },

    async delete(request: Request, response: Response) {
        try {
            //...
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