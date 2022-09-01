import { User } from "../commom/entities/User";
import { UserRepositoryImpl } from "./data/UserRepositoryImpl";
import { TokenUtils } from "./domain/TokenUtils";
import { UserRepository } from "./domain/UserRepository";
import { UserTokenResponse } from "./domain/UserTokenResponse";

import { Request, Response } from "express";
import { Random } from "../commom/utils/Random";

export class AuthController {
  private userRepository: UserRepository;
  private tokenUtils: TokenUtils;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
    this.tokenUtils = new TokenUtils();
  }

  public signUp = async (request: Request, response: Response) => {
    const activationCode = new Random().randomValidationCode();
    const { name, login, email, password } = request.body;
    const newUser: User = { name, login, email, password, active: false };

    const user = await this.userRepository.getBy(login);

    if (user) {
      return response
        .status(409)
        .json({ error: "A user with this login already exists" });
    }

    const result = await this.userRepository.insert(newUser);
    console.log(`\n\n====> Activation code: ${activationCode}. POST to /activate to activate your account.\n\n`);

    return response.status(200).json(result);
  };

  public signIn = async (request: Request, response: Response) => {
    const { login, password } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    return this.token(request, response);
  };

  public token = async (
    request: Request,
    response: Response
  ): Promise<Response<UserTokenResponse, Record<string, any>> | null> => {
    const { login, password } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      response.status(401).json({ error: "Invalid login or password" });
      return null;
    }

    user.refreshToken = this.tokenUtils.generate(user, "15d");
    user.tokenGenerationTime = Date.now();
    this.userRepository.update(user);

    let accessToken = this.tokenUtils.generate(user, "15m");
    let now = Date.now();
    return response.json({ user, accessToken, now });
  };

  public refreshToken = async (request: Request, response: Response) => {
    const { login, password } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    const refreshToken = user.refreshToken || "";

    this.tokenUtils.verify(refreshToken, (error, _) => {
      if (error) {
        return response.status(406).json({ message: "Unauthorized" });
      }

      return this.token(request, response);
    });
  };
}
