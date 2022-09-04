import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserRepositoryImpl } from "../auth/data/UserRepositoryImpl";
import { UserRepository } from "../auth/domain/UserRepository";
import { BookStatus } from "../commom/entities/book/BookStatus";
import { BooksRepositoryImpl } from "./data/BookRepositoryImpl";
import { BooksRepository } from "./domain/BooksRepository";
import { UserBookRequest } from "./UserBookRequest";

export class BookController {
  private booksRepository: BooksRepository;
  private userRepository: UserRepository;

  constructor() {
    this.booksRepository = new BooksRepositoryImpl();
    this.userRepository = new UserRepositoryImpl();
  }

  public list = async (request: Request, response: Response) => {
    const { login, password } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    this.booksRepository.setUserId(user.id || "");

    const books = await this.booksRepository.getAll();
    return response.status(200).json({ books: books });
  };

  public add = async (request: Request, response: Response) => {
    const { login, password, book } = request.body as UserBookRequest;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    if (!book) {
      return response.status(400).json({ error: "Invalid book to add" });
    }

    this.booksRepository.setUserId(user.id || "");

    await this.booksRepository.insert(book);
    return response.status(200).json({ book: book, added: true });
  };

  public remove = async (request: Request, response: Response) => {
    const { login, password, book } = request.body as UserBookRequest;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    if (!book) {
      return response.status(400).json({ error: "Invalid book to remove" });
    }

    this.booksRepository.setUserId(user.id || "");

    await this.booksRepository.remove(book);
    return response.status(200).json({ book: book, removed: true });
  };

  public setPage = async (request: Request, response: Response) => {
    const { login, password, id, page } = request.body

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    const book = await this.booksRepository.get({ _id: new ObjectId(id) });
    if (!book) {
      return response
        .status(400)
        .json({ error: `Invalid book to update: ${id}` });
    }

    this.booksRepository.setUserId(user.id || "");
    book.currentPage = page || 0;

    await this.booksRepository.update(book);
    return response.status(200).json({ book: book, updated: true });
  };

  public updateStatus = async (request: Request, response: Response) => {
    var { login, password, id, status } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    const book = await this.booksRepository.get({ _id: new ObjectId(id) });
    if (!book) {
      return response
        .status(400)
        .json({ error: `Invalid book to update: ${id}` });
    }

    if (!status) {
      status = BookStatus.NotAdded;
    }

    if (status < 0 || status > BookStatus.Finished) {
      status = BookStatus.NotAdded;
    }

    this.booksRepository.setUserId(user.id || "");
    book.status = status;

    await this.booksRepository.update(book);
    return response.status(200).json({ book: book, updated: true });
  };
}
