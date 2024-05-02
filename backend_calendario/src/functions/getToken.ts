import { Request } from "express";

export const getToken = (request: Request) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  return token;
};
