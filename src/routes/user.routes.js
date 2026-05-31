import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUserLikedVideos,
    getUserLikedPlaylist,
    getUserProfile
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ---------------------------------------------------------------------------
// Public routes — no token required
// ---------------------------------------------------------------------------

// Registration with optional avatar + cover image uploads
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

// Refresh access token using a valid refresh token (cookie or body)
router.route("/refresh-token").post(refreshAccessToken);

// Public user profile endpoints
router.route("/:userId/profile").get(getUserProfile);
router.route("/:userId/liked-videos").get(getUserLikedVideos);
router.route("/:userId/liked-playlist").get(getUserLikedPlaylist);

// ---------------------------------------------------------------------------
// Protected routes — valid JWT required
// ---------------------------------------------------------------------------

router.route("/logout").post(verifyJWT, logoutUser);

export default router;