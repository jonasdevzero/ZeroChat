import { GroupI } from "../user";

interface CreateGroupI {
    name: string
    description: string
    picture: File
    members: string[]
}

interface UpdateGroupI {
    groupId: string
    name: string
    description: string
}

interface UpdatePictureI {
    groupId: string
    picture: File | undefined
}

interface GroupUserI {
    groupId: string
    memberId: string
}

export default interface GroupService {
    create(data: CreateGroupI): Promise<GroupI>

    update(data: UpdateGroupI): Promise<{ name: string, description: string }>

    updatePicture(data: UpdatePictureI): Promise<{ location: string }>

    delete(groupId: string): Promise<string>

    addMember(data: GroupUserI): Promise<any>

    updateMember(data: GroupUserI): Promise<any>

    removeMember(data: GroupUserI): Promise<any>
}
