import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Contact, ContactMessages, User } from "../models";

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
            };

            const createdContact = await contactRepository.create(data).save();

            return response.status(201).json({ contact: createdContact });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error" });
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
            const contact = await contactRepository.findOne({ user: { id: sender_id }, contact_id: receiver_id });
            const receiverContact = await contactRepository.findOne({ user: { id: receiver_id }, contact_id: sender_id });

            if (!contact)
                return response.status(400).json({ message: "id_contact invalid" });

            // If the contact does not have the contact of the user who is sending the message, create the contact.
            if (!receiverContact) {
                const userRepository = getRepository(User);

                const user = await userRepository.findOne({ id: sender_id });
                const contactUser = await userRepository.findOne({ id: receiver_id });

                if (!user || !contactUser)
                    return response.status(400).json({ message: "Unexpected error" });

                const data = {
                    user: contactUser,
                    contact_id: sender_id,
                    contact_username: user.username,
                    contact_image: user.picture,
                };

                await contactRepository.create(data).save()
                    .catch(err => response.status(500).json({ message: "Unexpected error" }));
            };

            const contactMessagesRepository = getRepository(ContactMessages);

            await contactMessagesRepository.create({ message, sender_id, contact }).save();
            await contactMessagesRepository.create({ message, sender_id, contact: receiverContact }).save();

            return response.status(201).json({ message: "ok" });
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