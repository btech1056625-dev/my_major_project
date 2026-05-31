import { Router } from "express";
import { getVideoComments, addComment, updateComment, deleteComment } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/video/:videoId").get(getVideoComments).post(authMiddleware, addComment);
router.route("/:commentId").put(authMiddleware, updateComment).delete(authMiddleware, deleteComment);

export default router;
