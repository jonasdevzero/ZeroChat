import { Router } from "express";
import UserController from "./controllers/UserController";

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

export default routes;
