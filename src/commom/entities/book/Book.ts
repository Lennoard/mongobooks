import { BookStatus } from "./BookStatus";
import { Note } from "./Note";

export interface Book {
  id?: string;
  owner: string;
  title: string;
  tags: Array<string>;
  notes: Array<Note> | undefined;
  status: BookStatus
}
