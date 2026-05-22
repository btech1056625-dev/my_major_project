import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params  // channel id is the id of the user to which current user wants to subscribe or unsubscribe
    // TODO: toggle subscription

    if (!isValidObjectId(channelId)) {
        throw new ApiError("Invalid channel ID", 400)
    }
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError("Channel not found", 404)
    }
    
    const isSubscribed = await Subscription.findOne({
        $and: [
            {subscriber: req.user._id},
            {channel: channelId}
        ]
    })
    if (isSubscribed) {
        // User is subscribed, so unsubscribe
        await Subscription.deleteOne({
            $and: [
                {subscriber: req.user._id},
                {channel: channelId}
            ]
        })
        res.status(200).json(new ApiResponse(200, null, "Unsubscribed from channel successfully"))
    } else {
        // User is not subscribed, so subscribe
        const subscription = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
        res.status(201).json(new ApiResponse(201, subscription, "Subscribed to channel successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params   // channel id is the id of the user whose subscriber list we want to fetch
    if (!isValidObjectId(channelId)) {
        throw new ApiError("Invalid channel ID", 400)
    }
    const subscribers = await Subscription.find({channel: channelId}).populate("subscriber", "username fullName avatar")
    res.status(200).json(new ApiResponse(200, subscribers, "Subscriber list fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError("Invalid subscriber ID", 400)
    }
    const channels = await Subscription.find({subscriber: subscriberId}).populate("channel", "username fullName avatar")
    res.status(200).json(new ApiResponse(200, channels, "Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}