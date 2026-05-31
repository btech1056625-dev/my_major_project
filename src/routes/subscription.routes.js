import { Router } from "express";
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ---------------------------------------------------------------------------
// Public — GET subscribers / subscribed channels (read without login)
// Protected — POST toggle subscription (must be logged in)
// ---------------------------------------------------------------------------
router.route("/:channelId/toggle").post(verifyJWT, toggleSubscription);
router.route("/:channelId/subscribers").get(getUserChannelSubscribers);
router.route("/subscriber/:subscriberId/channels").get(getSubscribedChannels);

export default router;
