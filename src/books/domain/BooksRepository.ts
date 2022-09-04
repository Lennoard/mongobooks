import { Filter } from "mongodb";
import { Book } from "../../commom/entities/book/Book";

export interface BooksRepository {
  get(filter: Filter<Book>): Promise<Book | null>;
  getAll(): Promise<Array<Book> | null>;
  getBy(qualifier: String): Promise<Book | null>;
  insert(book: Book): Promise<Book | null>;
  remove(remove: Book): Promise<void>;
  update(book: Partial<Book>): Promise<void | null>;
  setUserId(id: String): void;
}
