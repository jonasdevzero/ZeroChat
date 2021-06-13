import { User } from "../user";

interface LogInI {
    reference: string
    password: string
    rememberMe: boolean
}

interface SubscribeI {
    username: string
    password: string
    confirmPassword: string
    name: string
    email: string
}

interface UpdateI {
    name: string
    username: string
}

interface UpdateEmailI {
    email: string
    password: string
}

interface ResetPasswordI {
    password: string
    confirmPassword: string
}

export default interface UserService {
    connect(): Promise<User>

    login(data: LogInI): Promise<string>

    subscribe(data: SubscribeI): Promise<string>

    update(data: UpdateI): Promise<UpdateI>

    updatePicture(picture: File | undefined): Promise<{ location: string }>

    updateEmail(data: UpdateEmailI): Promise<{ email: string }>

    forgotPassword(email: string): Promise<string>

    resetPassword(data: ResetPasswordI): Promise<string>

    delete(password: string): Promise<string>

    restore(username: string, password: string): Promise<string>

}
