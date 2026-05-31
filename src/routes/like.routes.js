import { Router } from "express";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ---------------------------------------------------------------------------
// All like endpoints are protected — you must be logged in to like/unlike
// ---------------------------------------------------------------------------
router.route("/video/:videoId/toggle").post(verifyJWT, toggleVideoLike);
router.route("/comment/:commentId/toggle").post(verifyJWT, toggleCommentLike);
router.route("/tweet/:tweetId/toggle").post(verifyJWT, toggleTweetLike);
router.route("/videos").get(verifyJWT, getLikedVideos);

export default router;
