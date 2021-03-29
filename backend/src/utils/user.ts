import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import aws from "aws-sdk";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const s3 = new aws.S3();
const secret = process.env.USER_SECRET || "";

export function encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export function generateToken(params: object) {
    return jwt.sign(params, secret, {
        expiresIn: 86400,
    });
};

export function comparePasswords(password: string, secretPassword: string) {
    return bcrypt.compareSync(password, secretPassword);
};

export function authenticateToken(token: string) {
    return jwt.verify(token, secret);
};

export function removePicture(key: string) {
    if (process.env.STORAGE_TYPE === "s3") {
        const picture_key = key.split(`${process.env.S3_BASE_URL}/`)[1];
        s3.deleteObject({ Bucket: "zero-chat", Key: picture_key }, (err, _data) => {
            if (err) console.log("error on [update.removing_image] {user} ->", err);
        });
    } else {
        const picture_key = key.split("http://localhost:3001/uploads/")[1];
        promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "uploads", picture_key));
    };
};