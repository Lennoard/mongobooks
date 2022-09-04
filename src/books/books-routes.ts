import { Router } from "express";
import { BookController } from "./BookController";

const router = Router();

const bookController = new BookController();
//const notesController = new BookNotesController();

router.get("/", bookController.list);
router.get("/list", bookController.list);
router.put("/", bookController.add);
router.delete("/", bookController.remove);
router.patch("/setpage", bookController.setPage);
router.patch("/updatestatus", bookController.updateStatus);

//router.post("/notes", notesController.list);
//router.post("/notes/add", notesController.add);
//router.post("/notes/remove", notesController.remove);
//router.post("/notes/list", notesController.list);

export default router;
