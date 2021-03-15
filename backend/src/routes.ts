import { Router } from "express";
import UserController from "./controllers/UserController";
import GroupController from "./controllers/GroupController";
import ContactController from "./controllers/ContactController";

const routes = Router();

routes.get("/", (req, res) => res.status(200).json("ok"));

routes.get("/user", UserController.index);
routes.get("/user/:username", UserController.show);

routes.post("/user", UserController.create);
routes.post("/user/auth", UserController.auth);
routes.post("/user/login", UserController.login);
routes.post("/user/forgot_password", UserController.forgotPassword);

routes.delete("/user/:id", UserController.auth, UserController.delete);

routes.put("/user/reset_password", UserController.resetPassword);
routes.put("/user/:id", UserController.auth, UserController.update);

routes.get("/group", GroupController.index);
routes.post("/group", UserController.auth, GroupController.create);

routes.get("/contact", UserController.auth, ContactController.index);
routes.get("/contact/messages", UserController.auth, ContactController.indexMessages);
routes.get("/contact/:id", UserController.auth, ContactController.show);

routes.post("/contact", UserController.auth, ContactController.create);
routes.post("/contact/message", UserController.auth ,ContactController.createMessage);

routes.put("/contact/message", UserController.auth, ContactController.update);

export default routes;
