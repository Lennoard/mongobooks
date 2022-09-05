import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserRepositoryImpl } from "../auth/data/UserRepositoryImpl";
import { UserRepository } from "../auth/domain/UserRepository";
import { BooksRepositoryImpl } from "./data/BookRepositoryImpl";
import { BooksRepository } from "./domain/BooksRepository";
import { NotesResponse } from "./domain/NotesResponse";

export class BookNotesController {
  private booksRepository: BooksRepository;
  private userRepository: UserRepository;

  constructor() {
    this.booksRepository = new BooksRepositoryImpl();
    this.userRepository = new UserRepositoryImpl();
  }

  public list = async (request: Request, response: Response) => {
    const { login, password, id } = request.body;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    this.booksRepository.setUserId(user.id || "");

    const book = await this.booksRepository.get({ _id: new ObjectId(id) });
    if (!book) {
      return response
        .status(400)
        .json({ error: `Invalid book to list notes: ${id}` });
    }

    return response.status(200).json({ notes: book.notes });
  };

  public add = async (request: Request, response: Response) => {
    const { login, password, id, notes } = request.body as NotesResponse;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    if (!notes) {
      return response.status(400).json({ error: "Invalid notes to add" });
    }

    const book = await this.booksRepository.get({ _id: new ObjectId(id) });
    if (!book) {
      return response
        .status(400)
        .json({ error: `Invalid book to list notes: ${id}` });
    }

    this.booksRepository.setUserId(user.id || "");

    book.notes = notes;
    await this.booksRepository.update(book);
    return response.status(200).json({ notes: notes, added: true });
  };

  public remove = async (request: Request, response: Response) => {
    const { login, password, id } = request.body as NotesResponse;

    const user = await this.userRepository.get({ login, password });
    if (!user) {
      return response.status(401).json({ error: "Invalid login or password" });
    }

    const book = await this.booksRepository.get({ _id: new ObjectId(id) });
    if (!book) {
      return response
        .status(400)
        .json({ error: `Invalid book to list notes: ${id}` });
    }

    this.booksRepository.setUserId(user.id || "");

    book.notes = undefined;
    delete book.notes;
    await this.booksRepository.update(book);
    return response.status(200).json({ removed: true });
  };
}
