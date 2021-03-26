import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Contact, ContactMessages, User } from "../models";
import { v4 as uuidv4 } from "uuid";
import { ContactView } from "../views";

export default {
    async index(request: Request, response: Response) {
        try {
            const id = response.locals.user.id; // from auth route
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
            const user_id = response.locals.user.id; // from auth route

            if (!id)
                return response.status(400).json({ message: "contact_id is empty!" });

            const contactRepository = getRepository(Contact);

            const contact = await contactRepository.findOne({ 
                where: { user: { id: user_id }, contact: { id } },
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
            const id = response.locals.user.id; // from auth route
            const { contact_id } = request.body;

            const userRepository = getRepository(User);
            const contactRepository = getRepository(Contact);

            const result = await Promise.all([
                userRepository.findOne({ where: { id: contact_id } }),
                contactRepository.findOne({ where: { user: { id }, contact: { id: contact_id } } })
            ]);

            const userContact = result[0];
            if (!userContact)
                return response.status(400).json({ message: "Invalid contact id" });

            const existsContact = result[1];
            if (existsContact)
                return response.status(400).json({ message: "Contact already exists" });

            const now = new Date();

            await Promise.all([
                contactRepository.create({ user: { id }, contact: { id: contact_id }, active: true, blocked: false, last_message_time: now }).save(),
                contactRepository.create({ user: { id: contact_id }, contact: { id }, active: false, blocked: false, last_message_time: now }).save()
            ]);
            const createdContact = await contactRepository.findOne({ where: { user: { id }, contact: { id: contact_id } }, relations: ["contact"] });

            if (!createdContact)
                return response.status(500).json({ message: "Uxnpected Error" });

            return response.status(201).json({ contact: ContactView.render(createdContact) });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal server error" });
        };
    },

    async update(request: Request, response: Response) {
        try {
            const contact_id = request.params.id.toString();
            const user_id = response.locals.user.id; // from auth route
            const { unread_messages } = request.query;

            const contactRepository = getRepository(Contact);
            const contact = await contactRepository.findOne({ user: { id: user_id }, contact: { id: contact_id } });

            if (!contact)
                return response.status(400).json({ message: "id or contact_id is invalid" });

            if (unread_messages === "true") {
                await contactRepository.update(contact, { unread_messages: undefined });
                return response.status(200).json({ message: "ok" });
            };                
            //...
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "internal Server Error" });
        };
    },

    async indexMessages(request: Request, response: Response) {
        try {
            const id = response.locals.user.id; // from auth route
            const { contact_id } = request.query;

            const contactRepository = getRepository(Contact);
            const contact = await contactRepository
                .createQueryBuilder("contact")
                .leftJoin("contact.user", "user")
                .leftJoin("contact.contact", "c")
                .leftJoinAndSelect("contact.messages", "messages")
                .where("user.id = :id", { id })
                .andWhere("c.id = :contact_id", { contact_id })
                .orderBy("messages.posted_at", "ASC")
                .getOne()

            if (!contact) 
                return response.status(400).json({ message: "Contact not found" });

            return response.status(200).json({ messages: contact.messages });
        } catch (err) {
            console.log(err);
            return response.status(500).json({ message: "Internal Server Error" });
        };
    },

    async createMessage(request: Request, response: Response) {
        try {
            const sender_id = response.locals.user.id; // from auth route
            const { message, receiver_id } = request.body;

            const contactRepository = getRepository(Contact);

            const contacts = await Promise.all([
                contactRepository.findOne({ user: { id: sender_id }, contact: { id: receiver_id } }),
                contactRepository.findOne({ user: { id: receiver_id }, contact: { id: sender_id } }),
            ]);
            const sender = contacts[0];
            const receiver = contacts[1];

            if (!receiver || !sender)
                return response.status(400).json({ message: "This contact not exists" });

            if (receiver?.blocked)
                return response.status(400).json({ message: "You are blocked" });

            const contactMessagesRepository = getRepository(ContactMessages);

            const double_contact_id = uuidv4();
            const posted_at = new Date();
            const unread_messages = typeof receiver.unread_messages == "number" ? ++receiver.unread_messages : 1;

            const result = await Promise.all([
                contactMessagesRepository.create({ message, sender_id, contact: sender, double_contact_id, posted_at }).save(),
                contactMessagesRepository.create({ message, sender_id, contact: receiver, double_contact_id, posted_at }).save(),
                contactRepository.update(receiver, { unread_messages, active: true, last_message_time: posted_at }),
                contactRepository.update(sender, { last_message_time: posted_at }),
            ]);
            const newMessage = result[0];

            const messageData = {
                ...newMessage,
                contact: {
                    id: receiver_id,
                    unread_messages
                }
            };

            return response.status(201).json({ message: messageData });
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