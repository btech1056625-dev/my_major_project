import { Router } from "express";
import { registerUser, loginUser, getUserLikedVideos, getUserLikedPlaylist, getUserProfile } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
const router = Router();


// User registration route with file upload middleware
router.route("/register").post(upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), registerUser);
router.route("/login").post(loginUser);

// Public user endpoints
router.route("/:userId/liked-videos").get(getUserLikedVideos);
router.route("/:userId/liked-playlist").get(getUserLikedPlaylist);
router.route("/:userId/profile").get(getUserProfile);

export default router;