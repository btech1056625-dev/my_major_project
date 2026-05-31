import { Router } from "express";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
} from "../controllers/playlist.contoller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ---------------------------------------------------------------------------
// Public — GET /user/:userId, GET /:playlistId  (read without login)
// Protected — POST, PUT, DELETE  (write operations require auth)
// ---------------------------------------------------------------------------
router.route("/").post(verifyJWT, createPlaylist);
router.route("/user/:userId").get(getUserPlaylists);
router.route("/:playlistId")
    .get(getPlaylistById)
    .put(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist);
router.route("/:playlistId/video/:videoId")
    .post(verifyJWT, addVideoToPlaylist)
    .delete(verifyJWT, removeVideoFromPlaylist);

export default router;
