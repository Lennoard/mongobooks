import { Router } from "express";
import { BookController } from "./BookController";

const router = Router();

const bookController = new BookController();

router.get("/", bookController.books);

export default router;
