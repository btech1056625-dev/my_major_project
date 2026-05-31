import { Router } from "express";
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ---------------------------------------------------------------------------
// Public — GET /user/:userId  (read-only, no token needed)
// Protected — POST, PUT, DELETE  (write operations require auth)
// ---------------------------------------------------------------------------
router.route("/").post(verifyJWT, createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId")
    .put(verifyJWT, updateTweet)
    .delete(verifyJWT, deleteTweet);

export default router;
