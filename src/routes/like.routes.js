import { Router } from "express";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos } from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/video/:videoId/toggle").post(authMiddleware, toggleVideoLike);
router.route("/comment/:commentId/toggle").post(authMiddleware, toggleCommentLike);
router.route("/tweet/:tweetId/toggle").post(authMiddleware, toggleTweetLike);
router.route("/videos").get(authMiddleware, getLikedVideos);

export default router;
