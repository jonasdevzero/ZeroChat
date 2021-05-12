interface CreateMessageI {
    type: "contact" | "group"
    to: string
    text?: string
    medias?: any[]
}

export default interface MessagesService {
    create(data: CreateMessageI): Promise<string>

    remove(type: "contact", { messageId, d }: { messageId: string, d: string }): Promise<string>
    remove(type: "group", { messageId }: { messageId: string }): Promise<string>
}
