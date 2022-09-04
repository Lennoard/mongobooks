import { Request, Response } from "express";
import { UserRepositoryImpl } from "../auth/data/UserRepositoryImpl";
import { UserRepository } from "../auth/domain/UserRepository";
import { UserCode } from "../commom/entities/UserCode";
import { Random } from "../commom/utils/Random";
import { SmsCodeReposotoryImpl } from "./data/SmsCodeReposotiryImpl]";
import { UserCodeReposotoryImpl } from "./data/UserCodeReposotiryImpl";
import { UserCodeRepository } from "./domain/UserCodeRepository";

export class UserController {
  private userRepository: UserRepository;
  private userCodeRepository: UserCodeRepository;
  private smsCodeRepository: SmsCodeReposotoryImpl;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
    this.userCodeRepository = new UserCodeReposotoryImpl();
    this.smsCodeRepository = new SmsCodeReposotoryImpl();
  }

  public requestActivation = async (request: Request, response: Response) => {
    const { login, password } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    const activationCode = new Random().randomValidationCode();
    const code: UserCode = {
      code: activationCode,
      userId: user.id || "",
      generationTime: Date.now(),
      phoneNumber: ''
    };

    await this.userCodeRepository.insert(code);
    const msg = `Code '${activationCode}' sent to email: ${user.email}`;
    console.log(msg);

    return response.status(200).json({ msg: msg });
  };

  public activate = async (request: Request, response: Response) => {
    const { login, password, allegedCode } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    const code = await this.userCodeRepository.get({
      userId: user.id || "",
      code: allegedCode,
    });    

    if (code) {
      await this.userRepository.update({ active: true });
      return response.status(200).json({ active: true });
    }

    return response.status(400).json({ error: "Bad activation code" });
  };

  public requestPhoneNumber = async (request: Request, response: Response) => {
    const { login, password, phoneNumber } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    if (await this.userRepository.get({ phoneNumber })) {
      return response.status(409).json({ error: "Phone number taken" });
    }

    const smsCode = new Random().randomSmsCode();
    const code: UserCode = {
      code: smsCode,
      userId: user.id || "",
      generationTime: Date.now(),
      phoneNumber: phoneNumber
    };

    await this.smsCodeRepository.insert(code);
    const msg = `Code '${smsCode}' sent to phone number: ${phoneNumber}`;
    console.log(msg);

    return response.status(200).json({ msg: msg });
  }

  public activatePhoneNumber = async (request: Request, response: Response) => {
    const { login, password, allegedCode, phoneNumber } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    if (!user.active) {
      return response.status(401).json({ error: "Must be active to request phone number" });
    }

    if (await this.userRepository.get({ phoneNumber })) {
      return response.status(409).json({ error: "Phone number taken" });
    }

    const code = await this.smsCodeRepository.get({
      userId: user.id || "",
      code: allegedCode,
      phoneNumber: phoneNumber
    }); 

    if (code) {
      await this.userRepository.update({ phoneNumber });
      return response.status(200).json({ phoneNumber: phoneNumber });
    }

    return response.status(400).json({ error: "Bad code" });
  };
}
