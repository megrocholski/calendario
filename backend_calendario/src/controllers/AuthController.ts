import z from "zod";
import { PrismaClient } from "@prisma/client";
import UserService from "../services/UserService";
import { Request, Response } from "express";
// import * as argon from "argon2";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
("jsonwebtoken");

const prisma = new PrismaClient();

class AuthController {
  async login(request: Request, response: Response) {
    try {
      const bodySchema = z.object({
        username: z.string(),
        password: z.string(),
      });
      const { username, password } = bodySchema.parse(request.body);
      const [user] = await Promise.all([UserService.findByLogin(username)]);
      //   console.log(user);
      if (user === null) {
        return response
          .status(418)
          .send({ error: "Usuário ou senha não encontrado" });
      }

      //   if (user.role != Role.ADMIN) {
      //     return response.status(401).send({ error: "Sem autorização" });
      //   }
      //   console.log(argon2)
      const isMatch = await argon2.verify(user.password, password);
      //   console.log(isMatch)
      if (isMatch) {
        if (!process.env.SECRET_KEY) {
          return response.status(500);
        }

        let token = jwt.sign(
          {
            username: user.username,
            idUser: user.userId,
            name: user.name,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "30 days",
          }
        );
        return response.json(token);
      } else {
        return response.send({ error: "Usuário ou senha não encontrado" });
      }
    } catch (error) {
      return response.status(400).send({ error: error });
    }
  }
}

export default new AuthController();
