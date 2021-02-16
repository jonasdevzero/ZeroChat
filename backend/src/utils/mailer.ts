import nodemailer from "nodemailer";

export default nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "7daad4f787a74f",
        pass: "2e8a1e039f9d9e"
    }
});
