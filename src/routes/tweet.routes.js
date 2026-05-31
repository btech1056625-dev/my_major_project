import { Router } from "express";
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/tweet.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(authMiddleware, createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").put(authMiddleware, updateTweet).delete(authMiddleware, deleteTweet);

export default router;
