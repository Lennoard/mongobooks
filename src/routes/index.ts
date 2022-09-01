import { Router } from "express";
import authRoutes from "../auth/auth-routes";
import bookRoutes from "../books/books-routes";
import userRoutes from "../user/user-routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/books", userRoutes);

export default router;
