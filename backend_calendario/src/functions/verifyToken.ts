import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { getToken } from "./getToken";

export default function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (!request.headers.authorization) {
    return response.status(401).send({ error: "Acesso Negado" });
  }
  const token = getToken(request);
  if (!token) {
    return response.status(401).send({ error: "Acesso Negado" });
  }

  try {
    const verify = jwt.verify(token, process.env.SECRET_KEY ?? "");
    if (verify) {
      next();
    } else {
      return response.status(400).send({ error: "Token inválida" });
    }
  } catch (error) {
    return response.status(400).send({ error: "Token inválida" });
  }
}
