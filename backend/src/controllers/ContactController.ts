import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Contact, ContactMessages, User } from "../models";
import { v4 as uuidv4 } from "uuid";

export default {
    async index(request: Request, response: Response) {
        try {
            const contactRepository = getRepository(Contact);

            const contacts = await contactRepository.find();

            return response.status(200).json({ contacts });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error" })
        };
    },

    async create(request: Request, response: Response) {
        try {
            const {
                id,
                contact_id,
            } = request.body;

            const userRepository = getRepository(User);

            const user = await userRepository.findOne(id);
            if (!user || id === contact_id)
                return response.status(400).json({ message: "Invalid Id" });

            const userContact = await userRepository.findOne({ where: { id: contact_id } });
            if (!userContact)
                return response.status(400).json({ message: "Invalid contact id" });


            const contactRepository = getRepository(Contact);

            const existsContact = await contactRepository.findOne({ where: { contact_id, user } });
            if (existsContact)
                return response.status(400).json({ message: "Contact already exists" });

            const data = {
                user,
                contact_id,
                contact_username: userContact.username,
                contact_image: userContact.picture,
                active: true,
            };
            const data2 = {
                user: userContact,
                contact_id: id,
                contact_username: user.username,
                contact_image: user.picture,
                active: false,
            };

            const createdContact = await contactRepository.create(data).save();
            await contactRepository.create(data2).save()


            return response.status(201).json({ contact: createdContact });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error" });
        };
    },

    async indexMessages(request: Request, response: Response) {
        try {
            const { id, contact_id } = request.query;

            const contactRepository = getRepository(Contact);

            const contact = await contactRepository.findOne({
                where: { contact_id, user: { id } },
                relations: ["messages"],
            });

            if (!contact) 
                return response.status(400).json({ message: "id or contact_id is invalid" })

            return response.status(200).json({ contact });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal Server Error" });
        };
    },

    async createMessage(request: Request, response: Response) {
        try {
            const {
                message,
                sender_id,
                receiver_id,
            } = request.body;

            const contactRepository = getRepository(Contact);
            const senderContact = await contactRepository.findOne({ user: { id: sender_id }, contact_id: receiver_id });
            const receiverContact = await contactRepository.findOne({ user: { id: receiver_id }, contact_id: sender_id });

            if (!senderContact)
                return response.status(400).json({ message: "id_contact invalid" });

            if (!receiverContact)
                return response.status(400).json({ message: "This contact not exists" });

            if (receiverContact?.blocked)
                return response.status(400).json({ message: "You are blocked" });

            if (!receiverContact?.active) {
                const id = receiverContact.id;
                await contactRepository.update(id, { active: true });
            };

            const contactMessagesRepository = getRepository(ContactMessages);

            const double_contact_id = uuidv4();

            const newMessage = await contactMessagesRepository.create({ message, sender_id, contact: senderContact, double_contact_id }).save();
            await contactMessagesRepository.create({ message, sender_id, contact: receiverContact, double_contact_id }).save();

            return response.status(201).json({ message: newMessage, senderContact });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error" });
        };
    },

    async deleteMessage(request: Request, response: Response) {
        try {
            //...
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error" });
        };
    },
};