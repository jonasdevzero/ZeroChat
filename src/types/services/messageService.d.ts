interface MessagesI {
    roomType: "contact" | "group"
    roomId: string
}

interface CreateMessageI {
    roomType: "contact" | "group"
    to: string
    text?: string
    medias?: any[]
}

export default interface MessagesService {
    get(data: MessagesI): Promise<any>

    create(data: CreateMessageI): Promise<string>

    viewed(data: MessagesI): Promise<string>

    remove(type: "contact", { messageId, d }: { messageId: string, d: string }): Promise<string>
    remove(type: "group", { messageId }: { messageId: string }): Promise<string>
}
