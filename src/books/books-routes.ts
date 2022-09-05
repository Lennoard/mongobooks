import { Router } from "express";
import { BookController } from "./BookController";
import { BookNotesController } from "./BookNotesController";

const router = Router();

const bookController = new BookController();
const notesController = new BookNotesController();

router.get("/", bookController.list);
router.get("/list", bookController.list);
router.put("/", bookController.add);
router.delete("/", bookController.remove);
router.patch("/setpage", bookController.setPage);
router.patch("/updatestatus", bookController.updateStatus);

router.post("/notes", notesController.list);
router.put("/notes/add", notesController.add);
router.delete("/notes/remove", notesController.remove);
router.post("/notes/list", notesController.list);

export default router;
