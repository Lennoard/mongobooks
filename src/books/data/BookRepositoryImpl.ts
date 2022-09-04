import { BooksRepository } from "../domain/BooksRepository";
import { Db, Filter, MongoClient } from "mongodb";
import { Book } from "../../commom/entities/book/Book";

export class BooksRepositoryImpl implements BooksRepository {
  private client: MongoClient;
  private db: Db;
  private userId: string = "";

  constructor() {
    const uri = "mongodb://localhost:27017";
    this.client = new MongoClient(uri);
    this.db = this.client.db("bookreading");
  }

  public async get(filter: Filter<Book>): Promise<Book | null> {
    return await this.getBooksCollection().findOne<Book>(filter);
  }

  public async getAll(): Promise<Book[] | null> {
   return await this.getBooksCollection().find().toArray();
  }

  public async getBy(name?: String): Promise<Book | null> {
    if (!name) return null;
    return await this.getBooksCollection().findOne<Book>({ name: name });
  }

  public async insert(user: Book): Promise<Book | null> {
    let result = await this.getBooksCollection().insertOne(user);
    user.id = result.insertedId.toString();
    return user;
  }

  public async update(book: Partial<Book>): Promise<void | null> {
    await this.getBooksCollection().updateOne({ id: book.id }, book);
  }

  public async remove(book: Partial<Book>): Promise<void> {
    await this.getBooksCollection().deleteOne({ id: book.id });
  }

  public setUserId(id: string) {
    this.userId = id;
  }

  private getBooksCollection = () => {
    return this.db.collection<Book>(`users/${this.userId}/books`);
  };
}
