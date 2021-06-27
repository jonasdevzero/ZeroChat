import { Group, GroupUser } from "../user"

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

export default interface GroupService {
    show(groupId: string): Promise<Group>

    create(data: CreateGroupI): Promise<Group>

    update(data: UpdateGroupI): Promise<{ name: string, description: string }>

    updatePicture(data: UpdatePictureI): Promise<{ location: string }>

    delete(groupId: string): Promise<string>

    getUsers(groupId: string): Promise<GroupUser[]>

    addMember(groupId: string, memberId: string): Promise<GroupUser>

    updateMember(groupId: string, memberId: string, role: 'user' | 'admim'): Promise<string>

    removeMember(groupId: string, memberId: string): Promise<string>
}
