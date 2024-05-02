import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import UserRouter from "./routes/UserRouter";
import TaskRouter from "./routes/TaskRouter";
import AuthRouter from "./routes/AuthRouter";

// import UserRouter from "./routes/UserRoutes";
// import AddressRouter from "./routes/AddressRoutes";
// import AuthRouter from "./routes/AuthRouter";
// import HelpRouter from "./routes/HelpRouter";
// import LogsRouter from "./routes/LogsRouter";
// import PhoneRouter from "./routes/PhoneRouter";

dotenv.config();

const server = express();
server.use(cors({ origin: "*", credentials: false }));
server.use(bodyParser.urlencoded({ extended: false }));

server.use(bodyParser.json());

server.use("/user", UserRouter);
server.use("/task", TaskRouter);
server.use("/login", AuthRouter);
// server.use("/address", AddressRouter);
// server.use("/login", AuthRouter);
// server.use("/help", HelpRouter);
// server.use("/logs", LogsRouter);
// server.use("/phone", PhoneRouter);

server.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${process.env.PORT}`);
});
