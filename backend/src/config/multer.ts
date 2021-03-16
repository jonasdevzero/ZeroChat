import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import path from "path";
import crypto from "crypto";

const storageTypes = {
    local: multer.diskStorage({
        destination: (request: Request, file: Express.Multer.File, callback) => {
            callback(null, path.resolve(__dirname, "..", "..", "uploads"));
        },
        filename: (request: Request, file: Express.Multer.File, callback) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) callback(err, "");

                file.filename = `${hash.toString("hex")}-${file.originalname}`;
                callback(null, file.filename);
            });
        },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: "zero-chat",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: (request, file, callback) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) callback(err);

                file.filename = `${hash.toString("hex")}-${file.originalname}`;
                callback(null, file.filename);
            });
        },
    })
};

export default {
    dest: path.resolve(__dirname, "..", "..", "uploads"),
    storage: storageTypes["local"],
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (request: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
        ];

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Invalid form type!"));
        };
    },
};
