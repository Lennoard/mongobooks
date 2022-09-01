import { Request, Response } from "express";
import { UserRepositoryImpl } from "../auth/data/UserRepositoryImpl";
import { UserRepository } from "../auth/domain/UserRepository";
import { BooksRepositoryImpl } from "./data/UserRepositoryImpl";
import { BooksRepository } from "./domain/BooksRepository";

export class BookController {
  private booksRepository: BooksRepository;
  private userRepository: UserRepository;

  constructor() {
    this.booksRepository = new BooksRepositoryImpl();
    this.userRepository = new UserRepositoryImpl();
  }

  public books = async (request: Request, response: Response) => {
    const { login, password } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    this.booksRepository.setUserId(user.id || "");

    const books = this.booksRepository.getAll();
    return response.status(200).json({ books: books });
  };
}
