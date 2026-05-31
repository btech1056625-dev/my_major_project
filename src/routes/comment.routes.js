import { Router } from "express";
import { getVideoComments, addComment, updateComment, deleteComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ---------------------------------------------------------------------------
// GET /video/:videoId — public (read comments without login)
// POST /video/:videoId — protected (must be logged in to comment)
// PUT / DELETE /:commentId — protected (only author can edit/delete)
// ---------------------------------------------------------------------------
router.route("/video/:videoId")
    .get(getVideoComments)
    .post(verifyJWT, addComment);

router.route("/:commentId")
    .put(verifyJWT, updateComment)
    .delete(verifyJWT, deleteComment);

export default router;
