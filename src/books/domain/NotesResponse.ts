import { Book } from "../../commom/entities/book/Book";
import { Note } from "../../commom/entities/book/Note";

export interface NotesResponse {
  login: string;
  password: string;
  id: string;
  notes?: Note[]
}
