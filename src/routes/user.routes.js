import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(import("../controllers/user.controller.js0").then(module => module.registerUser));
router.route("/login").post(import("../controllers/user.controller.js").then(module => module.loginUser));

export default router;