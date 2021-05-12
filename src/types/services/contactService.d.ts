import { ContactI } from "../user";

interface UpdateI {
    contactId: string
    action: string
}

export default interface ContactService {
    invite(contact_id: string): Promise<string>

    acceptInvite(invitation_id: string): Promise<ContactI>

    refuseInvite(invitation_id: string): Promise<string>

    update(data: UpdateI): Promise<string>
}
