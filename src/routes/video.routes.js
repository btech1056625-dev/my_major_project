import { Router } from "express";
import { publishVideo, getAllVideos, getVideoById, updateVideo, deleteVideo, togglePublishStatus } from "../controllers/video.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(authMiddleware, publishVideo).get(getAllVideos);
router.route("/:videoId").get(getVideoById).put(authMiddleware, updateVideo).delete(authMiddleware, deleteVideo);
router.route("/:videoId/publish").patch(authMiddleware, togglePublishStatus);

export default router;
