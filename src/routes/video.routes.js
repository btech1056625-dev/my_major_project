import { Router } from "express";
import {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// ---------------------------------------------------------------------------
// Public — GET /  (list all videos, no auth required)
// Protected — POST /  (publish a new video, auth required)
// ---------------------------------------------------------------------------
router.route("/")
    .get(getAllVideos)
    .post(verifyJWT, upload.fields([{ name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), publishVideo);

// ---------------------------------------------------------------------------
// GET /:videoId — optionalAuth enriches response if user is logged in
// PUT / DELETE /:videoId — protected
// ---------------------------------------------------------------------------
router.route("/:videoId")
    .get(optionalAuth, getVideoById)
    .put(verifyJWT, upload.fields([{ name: "thumbnail", maxCount: 1 }]), updateVideo)
    .delete(verifyJWT, deleteVideo);

router.route("/:videoId/publish").patch(verifyJWT, togglePublishStatus);

export default router;
