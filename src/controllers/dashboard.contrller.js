import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.params.channelId;

    // Validate channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError("Invalid channel ID", 400);
    }
    // Fetch total videos
    const totalVideos = await Video.countDocuments({ owner: channelId });
    // Fetch total views    
        const totalViews = await Video.aggregate([
        { $match: { owner: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    // Fetch total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    // Fetch total likes
    const totalLikes = await Like.aggregate([
        { $match: { channel: mongoose.Types.ObjectId(channelId), isLiked: true } },
        { $group: { _id: null, totalLikes: { $sum: 1 } } }
    ]); 
    res.status(200).json(
        new ApiResponse(200, {
            totalVideos: totalVideos,
            totalViews: totalViews[0]?.totalViews || 0,
            totalSubscribers: totalSubscribers,
            totalLikes: totalLikes[0]?.totalLikes || 0
        }, "Channel stats fetched successfully")
    );

})  


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.params.channelId;

    // Validate channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError("Invalid channel ID", 400);
    }
    const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });
    res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")

    );
});

export {
    getChannelStats, 
    getChannelVideos
    }