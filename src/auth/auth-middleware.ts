import { Request, Response, NextFunction } from "express";
import { UserRepositoryImpl } from "./data/UserRepositoryImpl";
import { UserRepository } from "./domain/UserRepository";

const userRepository: UserRepository = new UserRepositoryImpl();

export const AuthMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return response
      .status(401)
      .json({ error: "Access denied, invalid credentials." });
  }

  const [authType, credentials] = authorization.split(" ");

  if (authType === "Basic") {
    return checkBasicAuth(credentials, response, next);
  }

  return response
    .status(501)
    .json({ error: "Invalid request, must provide auth." });
};

const checkBasicAuth = async (
  credentials: string,
  response: Response,
  next: NextFunction
) => {
  let buff = Buffer.from(credentials, "base64");
  let [login, password] = buff.toString("ascii").split(":");

  const user = await userRepository.get({ login, password });
  if (!user) {
    return response.status(401).json({ error: "Invalid auth credentials." });
  }

  return next();
};
