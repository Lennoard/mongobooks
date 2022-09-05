import { Book } from "../../commom/entities/book/Book";

export interface UserBookRequest {
  login: string;
  password: string;
  book?: Book;
  page?: number
  status?: number
}
