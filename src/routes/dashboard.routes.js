import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.contrller.js";

const router = Router();

router.route("/:channelId/stats").get(getChannelStats);
router.route("/:channelId/videos").get(getChannelVideos);

export default router;
