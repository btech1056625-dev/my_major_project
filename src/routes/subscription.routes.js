import { Router } from "express";
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:channelId/toggle").post(authMiddleware, toggleSubscription);
router.route("/:channelId/subscribers").get(getUserChannelSubscribers);
router.route("/subscriber/:subscriberId/channels").get(getSubscribedChannels);

export default router;
