import { Router } from "express";
import { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, updatePlaylist, deletePlaylist } from "../controllers/playlist.contoller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(authMiddleware, createPlaylist);
router.route("/user/:userId").get(getUserPlaylists);
router.route("/:playlistId").get(getPlaylistById).put(authMiddleware, updatePlaylist).delete(authMiddleware, deletePlaylist);
router.route("/:playlistId/video/:videoId").post(authMiddleware, addVideoToPlaylist).delete(authMiddleware, removeVideoFromPlaylist);

export default router;
