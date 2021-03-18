import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Contact, ContactMessages, User } from "../models";
import { v4 as uuidv4 } from "uuid";
import { ContactView } from "../views";

export default {
    async index(request: Request, response: Response) {
        try {
            const { id } = request.query;
            const contactRepository = getRepository(Contact);

            const contacts = await contactRepository
                .createQueryBuilder("contact")
                .orderBy("contact.last_message_time", "DESC")
                .leftJoin("contact.user", "user")
                .where("user.id = :id", { id })
                .leftJoinAndSelect("contact.contact", "c")
                .getMany()

            return response.status(200).json({ contacts: ContactView.renderMany(contacts) });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error" })
        };
    },

    async show(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const { user_id } = request.query;

            if (!user_id || !id)
                return response.status(400).json({ message: "user_id or contact_id is empty!" });

            const contactRepository = getRepository(Contact);

            const contact = await contactRepository.findOne({ 
                where: { user: { id: String(user_id) }, contact: { id } },
                relations: ["contact", "messages"],     
            });

            if (!contact) 
                return response.status(400).json({ message: "Contact does not found" });
                
            return response.status(200).json({ contact: ContactView.render(contact) });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal Server Error" });
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

            const now = new Date();
            const data = {
                user,
                contact_id: userContact.id,
                contact: userContact,
                active: true,
                blocked: false,
                last_message_time: now,
            };
            const data2 = {
                user: userContact,
                contact: user,
                active: false,
                blocked: false,
                last_message_time: now,
            };

            const createdContact = await contactRepository.create(data).save();
            await contactRepository.create(data2).save()

            return response.status(201).json({ contact: ContactView.render(createdContact) });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error" });
        };
    },

    async update(request: Request, response: Response) {
        try {
            const {
                user_id,
                contact_id,
                unread_messages
            } = request.body;
            const { only_unread_messages } = request.query;

            const contactRepository = getRepository(Contact);
            const contact = await contactRepository.findOne({ user: { id: user_id }, contact: { id: contact_id } });

            if (!contact)
                return response.status(400).json({ message: "id or contact_id is invalid" });

            const id = contact.id;

            if (Boolean(only_unread_messages)) {
                await contactRepository.update(id, { unread_messages: unread_messages == 0 ? null : unread_messages });
                return response.status(201).json({ message: "ok" });
            };

            //...
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "internal Server Error" });
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
                id_contact,
            } = request.body;

            const contactRepository = getRepository(Contact);
            let receiverContact = await contactRepository.findOne({ user: { id: receiver_id }, contact: { id: sender_id } });

            if (!receiverContact)
                return response.status(400).json({ message: "This contact not exists" });

            if (receiverContact?.blocked)
                return response.status(400).json({ message: "You are blocked" });


            const contactMessagesRepository = getRepository(ContactMessages);

            const double_contact_id = uuidv4();
            const posted_at = new Date();
            const unread_messages = typeof receiverContact.unread_messages == "number" ? ++receiverContact.unread_messages : 1;

            const messageData = await contactMessagesRepository.create({ 
                message, 
                sender_id, 
                contact: { 
                    id: id_contact 
                }, 
                double_contact_id, 
                posted_at 
            }).save();
            await contactMessagesRepository.create({ 
                message, 
                sender_id, 
                contact: { 
                    id: receiverContact.id 
                }, 
                double_contact_id, 
                posted_at 
            }).save();

            const id = receiverContact.id;
            await contactRepository.update(id, { unread_messages, active: true, last_message_time: posted_at });

            await contactRepository
                .createQueryBuilder("contact")
                .leftJoin("contact.user", "user")
                .update()
                .set({ last_message_time: posted_at })                
                .where("user.id = :user_id", { user_id: sender_id  })
                .andWhere("contact.contact_id = :contact_id", { contact_id: receiver_id })
                .execute();

            const newMessage = {
                id: messageData.id,
                double_contact_id: messageData.double_contact_id,
                id_contact,
                sender_id,
                message,
                contact: {
                    id: receiver_id,
                    unread_messages,
                },
                posted_at
            };

            return response.status(201).json({ message: newMessage });
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