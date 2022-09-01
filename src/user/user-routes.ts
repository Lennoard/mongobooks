import { Router } from "express";
import { UserController } from "./UserController";

const router = Router();

const userController = new UserController();

router.post("/activate", userController.activate);
router.post("/activate/request", userController.requestActivation);

router.post("/activate/phone", userController.activatePhoneNumber);
router.post("/activate/phone/request", userController.requestPhoneNumber);

export default router;
