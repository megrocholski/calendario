import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import argon from "argon2";
import UserService from "../services/UserService";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

class UserController {
  async create(request: Request, response: Response) {
    try {
      const bodySchema = z.object({
        username: z.string(),
        name: z.string(),
        password: z.string(),
      });
      const { name, password, username } = bodySchema.parse(request.body);

      const hash = await argon.hash(password);
      const user = await UserService.create(username, name, hash);

      return response.json(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return response
            .status(400)
            .send({ error: "Esse nome de usuário já existe" });
        }
      }
      return response.status(400).send({ error: error });
    }
  }

  async show(request: Request, response: Response) {
    try {
      const paramsSchema = z.object({
        idUser: z.string(),
      });

      const { idUser } = paramsSchema.parse(request.params);

      const usuario = await UserService.show(idUser);

      return response.json(usuario);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return response
            .status(400)
            .send({ error: "Usuário não encontrado." });
        }
      }
      return response.status(400).send({ error: error });
    }
  }
  async list(request: Request, response: Response) {
    try {

      const usuario = await UserService.list();

      return response.json(usuario);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return response
            .status(400)
            .send({ error: "Usuário não encontrado." });
        }
      }
      return response.status(400).send({ error: error });
    }
  }
  async update(request: Request, response: Response) {
    try {
      const paramsSchema = z.object({
        idUser: z.string(),
      });
      const bodySchema = z.object({
        username: z.string().optional(),
        password: z.string().optional(),
        name: z.string().optional(),
      });

      const { idUser } = paramsSchema.parse(request.params);
      const { username, password, name } = bodySchema.parse(request.body);

      const usuarioSenha = await prisma.user.findUniqueOrThrow({
        where: {
          userId: idUser,
        },
      });
      let hash;
      if (!usuarioSenha) {
        return response.send({ message: "Usuário ou senha não encontrado" });
      }
      if (password) {
        if (await argon.verify(usuarioSenha.password, password)) {
          return response.send({ message: "Não pode utilizar a mesma senha" });
        }

        hash = await argon.hash(password);
      }

      const usuario = await UserService.update(idUser, username, name, hash);

      return response.json(usuario);
    } catch (error) {
      return response.status(400).send({ error: error });
    }
  }
  async delete(request: Request, response: Response) {
    try {
      const paramsSchema = z.object({
        idUser: z.string(),
      });
      const { idUser } = paramsSchema.parse(request.params);

      const usuario = await UserService.show(idUser);
      if (usuario) {
        await UserService.delete(idUser);

        return response.json(usuario);
      } else {
        return response.json("Usuário não existe");
      }
    } catch (error) {
      return response.status(400).send({ error: error });
    }
  }
}

export default new UserController();
