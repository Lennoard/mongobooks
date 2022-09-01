import { Router } from "express";
import { AuthController } from "./AuthController";

const router = Router();

const authController = new AuthController();

router.post("/signup", authController.signUp);

router.post("/signin", authController.signIn);

router.post("/refreshtoken", authController.refreshToken);

export default router;
