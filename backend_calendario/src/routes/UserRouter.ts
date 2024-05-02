import express from "express";
import UserController from "../controllers/UserController";
import verifyToken from "../functions/verifyToken";

const UserRouter = express.Router();

UserRouter.post("/create", UserController.create);
UserRouter.get("/list", UserController.list);
UserRouter.get("/show/:idUser", verifyToken, UserController.show);
UserRouter.put("/update/:idUser", verifyToken, UserController.update);
UserRouter.delete("/delete/:idUser", verifyToken, UserController.delete);

export default UserRouter;
