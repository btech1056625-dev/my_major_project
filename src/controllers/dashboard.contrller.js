import mongoose from "mongoose"
import { Video } from "../models/Video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { APIError } from "../utils/apierror.js"
import { APIResponse } from "../utils/Apiresponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const getChannelStats = asynchandler(async (req, res) => {
    
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.params.channelId;

    // Validate channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new APIError("Invalid channel ID", 400);
    }
    // Fetch total videos
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Fetch total views
    const totalViews = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    // Fetch total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Fetch total likes for the channel's videos
    const totalLikes = await Like.aggregate([
        { $match: { isLiked: true, video: { $exists: true } } },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        { $unwind: "$videoDetails" },
        { $match: { "videoDetails.owner": new mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalLikes: { $sum: 1 } } }
    ]);
    return res.status(200).json(
        new APIResponse("Channel stats fetched successfully", 200, {
            totalVideos: totalVideos,
            totalViews: totalViews[0]?.totalViews || 0,
            totalSubscribers: totalSubscribers,
            totalLikes: totalLikes[0]?.totalLikes || 0
        })
    );

})  


const getChannelVideos = asynchandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.params.channelId;

    // Validate channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new APIError("Invalid channel ID", 400);
    }
    const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });
    return res.status(200).json(
        new APIResponse("Channel videos fetched successfully", 200, videos)
    );
});

export {
    getChannelStats, 
    getChannelVideos
    }