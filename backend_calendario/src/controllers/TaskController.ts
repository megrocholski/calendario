import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import argon from "argon2";
import UserService from "../services/UserService";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import TaskService from "../services/TaskService";

const prisma = new PrismaClient();

class TaskController {
  async create(request: Request, response: Response) {
    try {
      const bodySchema = z.object({
        title: z.string(),
        desc: z.string(),
        date: z.coerce.date(),
        duration: z.number(),
        userId: z.string(),
      });
      const { date, desc, duration, title, userId } = bodySchema.parse(
        request.body
      );

      const task = await TaskService.create(
        title,
        desc,
        date,
        duration,
        userId
      );

      return response.json(task);
    } catch (error) {
      //   if (error instanceof PrismaClientKnownRequestError) {
      //     // if (error.code === "P2002") {
      //     //   return response
      //     //     .status(400)
      //     //     .send({ error: "Esse nome de usuário já existe" });
      //     // }
      //   }
      return response.status(400).send({ error: error });
    }
  }

  async show(request: Request, response: Response) {
    try {
      const paramsSchema = z.object({
        idTask: z.string(),
      });

      const bodySchema = z.object({
        // type: z.string().optional(),
        initialDate: z.coerce.date().optional(),
        finalDate: z.coerce.date().optional(),
        search: z.string().optional(),
      });

      const { idTask } = paramsSchema.parse(request.params);

      const { finalDate, initialDate, search } = bodySchema.parse(
        request.query
      );

      const task = await TaskService.show(
        idTask,
        search,
        initialDate,
        finalDate
      );

      return response.json(task);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return response.status(400).send({ error: "Tarefa não encontrada." });
        }
      }
      return response.status(400).send({ error: error });
    }
  }
  async list(request: Request, response: Response) {
    try {
      const paramsSchema = z.object({
        idUser: z.string(),
      });

      const bodySchema = z.object({
        // type: z.string().optional(),
        initialDate: z.coerce.date().optional(),
        finalDate: z.coerce.date().optional(),
        finishedS: z.string().optional(),
        search: z.string().optional(),
      });

      const { idUser } = paramsSchema.parse(request.params);

      const { finalDate, initialDate, search, finishedS } = bodySchema.parse(
        request.query
      );
      let finished;
      if (finishedS !== undefined) {
        finished = finishedS == "true";
      }

      const task = await TaskService.list(
        idUser,
        search,
        initialDate,
        finalDate,
        finished
      );

      return response.json(task);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return response.status(400).send({ error: "Tarefa não encontrada." });
        }
      }
      return response.status(400).send({ error: error });
    }
  }
  async update(request: Request, response: Response) {
    try {
      const paramsSchema = z.object({
        idTask: z.string(),
      });
      const bodySchema = z.object({
        title: z.string().optional(),
        desc: z.string().optional(),
        date: z.coerce.date().optional(),
        duration: z.number().optional(),
        finished: z.boolean().optional(),
      });

      const { idTask } = paramsSchema.parse(request.params);
      const { date, desc, duration, title, finished } = bodySchema.parse(
        request.body
      );

      const task = await prisma.task.findUniqueOrThrow({
        where: {
          taskId: idTask,
        },
      });
      if (!task) {
        return response.send({ message: "Tarefa não encontrada." });
      }

      const newTask = await TaskService.update(
        idTask,
        title,
        desc,
        date,
        duration,
        finished
      );

      return response.json(newTask);
    } catch (error) {
      return response.status(400).send({ error: error });
    }
  }
  async delete(request: Request, response: Response) {
    try {
      const paramsSchema = z.object({
        idTask: z.string(),
      });
      const { idTask } = paramsSchema.parse(request.params);

      const usuario = await TaskService.show(idTask);
      if (usuario) {
        await TaskService.delete(idTask);

        return response.json(usuario);
      } else {
        return response.json("Tarefa não existe");
      }
    } catch (error) {
      return response.status(400).send({ error: error });
    }
  }
}

export default new TaskController();
