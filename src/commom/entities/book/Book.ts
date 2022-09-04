import { BookStatus } from "./BookStatus";
import { Note } from "./Note";

export interface Book {
  id?: string;
  owner: string;
  title: string;
  tags?: string[];
  notes?: Note[];
  status: BookStatus;
  currentPage: number;
}
