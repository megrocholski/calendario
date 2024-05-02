import express from "express";
import AuthController from "../controllers/AuthController";

const AuthRouter = express.Router();

AuthRouter.post("/", AuthController.login);

export default AuthRouter;
