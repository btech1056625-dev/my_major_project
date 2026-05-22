import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { APIError } from "../utils/apierror.js";
import { APIResponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Video } from "../models/Video.model.js";
import { User } from "../models/User.model.js";
import { Playlist } from "../models/playlist.model.js";

// Toggle like on video
const toggleVideoLike = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    // Step 1: Validate videoId
    if (!isValidObjectId(videoId)) {
        throw new APIError("Invalid video ID", 400);
    }

    // Step 2: Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new APIError("Video not found", 404);
    }

    // Step 3: Check if like record exists
    let like = await Like.findOne({
        video: videoId,
        user: userId
    });

    if (like && like.isLiked) {
        // UNLIKE: Remove video from all liked lists
        
        // Update Like model
        like.isLiked = false;
        await like.save();

        // Remove from User's likedVideos array
        await User.findByIdAndUpdate(
            userId,
            { $pull: { likedVideos: videoId } },
            { new: true }
        );

        // Remove from video's likedBy array
        video.likedBy.pull(userId);
        await video.save();

        // Remove from liked playlist
        const user = await User.findById(userId);
        if (user.likedPlaylist) {
            await Playlist.findByIdAndUpdate(
                user.likedPlaylist,
                { $pull: { videos: videoId } },
                { new: true }
            );
        }

        return res.status(200).json(
            new APIResponse("Video unliked", 200, { isLiked: false })
        );
    } else {
        // LIKE: Add video to all liked lists
        
        // Create/Update Like model
        if (!like) {
            like = await Like.create({
                video: videoId,
                user: userId,
                isLiked: true
            });
        } else {
            like.isLiked = true;
            await like.save();
        }

        // Add to User's likedVideos array (prevent duplicates)
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { likedVideos: videoId } },
            { new: true }
        );

        // Add to video's likedBy array
        video.likedBy.addToSet(userId);
        await video.save();

        // Add to liked playlist or create if doesn't exist
        let likedPlaylist = user.likedPlaylist
            ? await Playlist.findById(user.likedPlaylist)
            : null;

        if (!likedPlaylist) {
            // Create "Liked Videos" playlist
            likedPlaylist = await Playlist.create({
                title: "Liked Videos",
                description: "All videos I liked",
                videos: [videoId],
                owner: userId
            });

            // Update user with reference to liked playlist
            await User.findByIdAndUpdate(
                userId,
                { likedPlaylist: likedPlaylist._id },
                { new: true }
            );
        } else {
            // Add video to existing liked playlist (prevent duplicates)
            await Playlist.findByIdAndUpdate(
                likedPlaylist._id,
                { $addToSet: { videos: videoId } },
                { new: true }
            );
        }

        return res.status(200).json(
            new APIResponse("Video liked", 200, { isLiked: true })
        );
    }
});

// Toggle like on comment
const toggleCommentLike = asynchandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Step 1: Validate commentId
    if (!isValidObjectId(commentId)) {
        throw new APIError("Invalid comment ID", 400);
    }

    // Step 2: Check if like record exists for comment
    let like = await Like.findOne({
        comment: commentId,
        user: userId
    });

    if (like && like.isLiked) {
        // UNLIKE: Remove like from comment
        like.isLiked = false;
        await like.save();

        return res.status(200).json(
            new APIResponse("Comment unliked", 200, { isLiked: false })
        );
    } else {
        // LIKE: Add like to comment
        
        if (!like) {
            like = await Like.create({
                comment: commentId,
                user: userId,
                isLiked: true
            });
        } else {
            like.isLiked = true;
            await like.save();
        }

        return res.status(200).json(
            new APIResponse("Comment liked", 200, { isLiked: true })
        );
    }
});

// Toggle like on tweet
const toggleTweetLike = asynchandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    // Step 1: Validate tweetId
    if (!isValidObjectId(tweetId)) {
        throw new APIError("Invalid tweet ID", 400);
    }

    // Step 2: Check if like record exists for tweet
    let like = await Like.findOne({
        tweet: tweetId,
        user: userId
    });

    if (like && like.isLiked) {
        // UNLIKE: Remove like from tweet
        like.isLiked = false;
        await like.save();

        return res.status(200).json(
            new APIResponse("Tweet unliked", 200, { isLiked: false })
        );
    } else {
        // LIKE: Add like to tweet
        
        if (!like) {
            like = await Like.create({
                tweet: tweetId,
                user: userId,
                isLiked: true
            });
        } else {
            like.isLiked = true;
            await like.save();
        }

        return res.status(200).json(
            new APIResponse("Tweet liked", 200, { isLiked: true })
        );
    }
});

// Get all liked videos
const getLikedVideos = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    // Step 1: Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Step 2: Get user's liked videos
    const user = await User.findById(userId)
        .populate({
            path: 'likedVideos',
            populate: { path: 'owner', select: 'username avatar' },
            options: { skip, limit: limitNum }
        });

    if (!user) {
        throw new APIError("User not found", 404);
    }

    // Step 3: Get total count
    const totalLiked = user.likedVideos.length;

    return res.status(200).json(
        new APIResponse("Liked videos fetched", 200, {
            likedVideos: user.likedVideos,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: totalLiked,
                pages: Math.ceil(totalLiked / limitNum)
            }
        })
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
                { new: true }
            );
        }

        return res.status(200).json(
            new APIResponse("Video unliked successfully", 200, { isLiked: false })
        );
    } else {
        // LIKE: Add video to all liked lists
        
        // Create/Update Like model
        if (!like) {
            like = await Like.create({
                video: videoId,
                user: userId,
                isLiked: true
            });
        } else {
            like.isLiked = true;
            await like.save();
        }

        // Add to User's likedVideos array (prevent duplicates)
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { likedVideos: videoId } },
            { new: true }
        );

        // Add to video's likedBy array
        video.likedBy.addToSet(userId);
        await video.save();

        // Add to liked playlist or create if doesn't exist
        let likedPlaylist = user.likedPlaylist
            ? await Playlist.findById(user.likedPlaylist)
            : null;

        if (!likedPlaylist) {
            // Create "Liked Videos" playlist
            likedPlaylist = await Playlist.create({
                title: "Liked Videos",
                description: "All videos I liked",
                videos: [videoId],
                owner: userId
            });

            // Update user with reference to liked playlist
            await User.findByIdAndUpdate(
                userId,
                { likedPlaylist: likedPlaylist._id },
                { new: true }
            );
        } else {
            // Add video to existing liked playlist (prevent duplicates)
            await Playlist.findByIdAndUpdate(
                likedPlaylist._id,
                { $addToSet: { videos: videoId } },
                { new: true }
            );
        }

        return res.status(200).json(
            new APIResponse("Video liked successfully", 200, { isLiked: true })
        );
    }
});

// Check if user liked a video
const isVideoLiked = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const like = await Like.findOne({
        video: videoId,
        user: userId,
        isLiked: true
    });

    return res.status(200).json(
        new APIResponse(
            "Like status fetched",
            200,
            { isLiked: !!like }
        )
    );
});

// Toggletweetlike

const toggleTweetLike = asynchandler(async (req, res) => {
    // Implementation for toggling tweet likes

});


// Get total likes on a video
const getVideoLikes = asynchandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId)
        .populate('likedBy', 'username avatar');

    if (!video) {
        throw new APIError("Video not found", 404);
    }

    return res.status(200).json(
        new APIResponse(
            "Video likes fetched",
            200,
            {
                totalLikes: video.likedBy.length,
                likedBy: video.likedBy
            }
        )
    );
});

export { toggleVideoLike, isVideoLiked, getVideoLikes };