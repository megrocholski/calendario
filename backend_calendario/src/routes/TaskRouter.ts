import express from "express";
import TaskController from "../controllers/TaskController";
import verifyToken from "../functions/verifyToken";

const TaskRouter = express.Router();

TaskRouter.post("/create", verifyToken, TaskController.create);
TaskRouter.get("/list/:idUser", verifyToken, TaskController.list);
TaskRouter.get("/show/:idTask", verifyToken, TaskController.show);
TaskRouter.put("/update/:idTask", verifyToken, TaskController.update);
TaskRouter.delete("/delete/:idTask", verifyToken, TaskController.delete);

export default TaskRouter;
