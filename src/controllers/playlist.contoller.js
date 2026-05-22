import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { APIError } from "../utils/apierror.js";
import { APIResponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Video } from "../models/Video.model.js";

// Create a new playlist
const createPlaylist = asynchandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user._id;

    // Step 1: Validate inputs
    if (!title || !title.trim()) {
        throw new APIError("Playlist title is required", 400);
    }

    // Step 2: Create playlist
    const playlist = await Playlist.create({
        title: title.trim(),
        description: description?.trim() || "",
        videos: [],
        owner: userId
    });

    return res.status(201).json(
        new APIResponse("Playlist created successfully", 201, playlist)
    );
});

// Get user's playlists
const getUserPlaylists = asynchandler(async (req, res) => {
    const { userId } = req.params;

    // Step 1: Validate userId
    if (!isValidObjectId(userId)) {
        throw new APIError("Invalid user ID", 400);
    }

    // Step 2: Fetch user's playlists
    const playlists = await Playlist.find({ owner: userId })
        .populate('videos', 'title thumbnail duration')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new APIResponse("User playlists fetched successfully", 200, {
            playlists,
            totalPlaylists: playlists.length
        })
    );
});

// Get playlist by ID
const getPlaylistById = asynchandler(async (req, res) => {
    const { playlistId } = req.params;

    // Step 1: Validate playlistId
    if (!isValidObjectId(playlistId)) {
        throw new APIError("Invalid playlist ID", 400);
    }

    // Step 2: Fetch playlist with populated videos and owner
    const playlist = await Playlist.findById(playlistId)
        .populate({
            path: 'videos',
            populate: { path: 'owner', select: 'username avatar' }
        })
        .populate('owner', 'username avatar fullName');

    if (!playlist) {
        throw new APIError("Playlist not found", 404);
    }

    return res.status(200).json(
        new APIResponse("Playlist fetched successfully", 200, playlist)
    );
});

// Add video to playlist
const addVideoToPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user._id;

    // Step 1: Validate IDs
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new APIError("Invalid playlist or video ID", 400);
    }

    // Step 2: Validate playlist exists and user is owner
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new APIError("Playlist not found", 404);
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new APIError("You are not authorized to update this playlist", 403);
    }

    // Step 3: Validate video exists
    const video = await Video.findById(videoId);

    if (!video) {
        throw new APIError("Video not found", 404);
    }

    // Step 4: Check if video already in playlist
    if (playlist.videos.includes(videoId)) {
        throw new APIError("Video already exists in playlist", 409);
    }

    // Step 5: Add video to playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $push: { videos: videoId } },
        { new: true }
    ).populate('videos');

    return res.status(200).json(
        new APIResponse("Video added to playlist successfully", 200, updatedPlaylist)
    );
});

// Remove video from playlist
const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user._id;

    // Step 1: Validate IDs
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new APIError("Invalid playlist or video ID", 400);
    }

    // Step 2: Validate playlist exists and user is owner
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new APIError("Playlist not found", 404);
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new APIError("You are not authorized to update this playlist", 403);
    }

    // Step 3: Remove video from playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    ).populate('videos');

    return res.status(200).json(
        new APIResponse("Video removed from playlist successfully", 200, updatedPlaylist)
    );
});

// Update playlist details
const updatePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params;
    const { title, description } = req.body;
    const userId = req.user._id;

    // Step 1: Validate playlistId
    if (!isValidObjectId(playlistId)) {
        throw new APIError("Invalid playlist ID", 400);
    }

    // Step 2: Validate input
    if (!title || !title.trim()) {
        throw new APIError("Playlist title is required", 400);
    }

    // Step 3: Validate playlist exists and user is owner
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new APIError("Playlist not found", 404);
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new APIError("You are not authorized to update this playlist", 403);
    }

    // Step 4: Update playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            title: title.trim(),
            description: description?.trim() || ""
        },
        { new: true }
    );

    return res.status(200).json(
        new APIResponse("Playlist updated successfully", 200, updatedPlaylist)
    );
});

// Delete playlist
const deletePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user._id;

    // Step 1: Validate playlistId
    if (!isValidObjectId(playlistId)) {
        throw new APIError("Invalid playlist ID", 400);
    }

    // Step 2: Validate playlist exists and user is owner
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new APIError("Playlist not found", 404);
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new APIError("You are not authorized to delete this playlist", 403);
    }

    // Step 3: Delete playlist
    await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json(
        new APIResponse("Playlist deleted successfully", 200, null)
    );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
};
        playlistId,
        {
            $addToSet: {videos: videoId}
        },
        {new: true}
    )
    res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError("Invalid playlist or video ID", 400)
    }
    // TODO: remove video from playlist
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {videos: videoId}
        },
        {new: true}
    )
    res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError("Invalid playlist ID", 400)
    }
    // TODO: delete playlist
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
    if (!deletedPlaylist) {
        throw new ApiError("Playlist not found", 404)
    }
    res.status(200).json(new ApiResponse(200, null, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if (!isValidObjectId(playlistId)) {
        throw new ApiError("Invalid playlist ID", 400)
    }
    //TODO: update playlist

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError("Playlist not found", 404)
    }
    // Check if the user is the owner of the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("Only the owner can update the playlist", 403)
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {name, description},
        {new: true}
    )
    res.status(200).json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}