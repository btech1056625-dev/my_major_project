import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(import(registerUser));
router.route("/login").post(import(loginUser));

export default router;