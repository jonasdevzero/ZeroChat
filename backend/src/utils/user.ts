import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secret = process.env.USER_SECRET || "";

export function encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export function generateToken(params: object) {
    return jwt.sign(params, secret);
};

export function comparePasswords(password: string, secretPassword: string) {
    return bcrypt.compareSync(password, secretPassword);
};

export function authenticateToken(token: string) {
    return jwt.verify(token, secret);
};
