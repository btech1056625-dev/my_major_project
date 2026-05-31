import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/User.model.js"
import { Subscription } from "../models/subscription.model.js"
import { APIError } from "../utils/apierror.js"
import { APIResponse } from "../utils/Apiresponse.js"
import { asynchandler } from "../utils/asynchandler.js"


const toggleSubscription = asynchandler(async (req, res) => {
    const {channelId} = req.params  // channel id is the id of the user to which current user wants to subscribe or unsubscribe
    // TODO: toggle subscription

    if (!isValidObjectId(channelId)) {
        throw new APIError("Invalid channel ID", 400)
    }
    const channel = await User.findById(channelId)
    if (!channel) {
        throw new APIError("Channel not found", 404)
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
        return res.status(200).json(new APIResponse("Unsubscribed from channel successfully", 200, null))
    } else {
        // User is not subscribed, so subscribe
        const subscription = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
        return res.status(201).json(new APIResponse("Subscribed to channel successfully", 201, subscription))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const {channelId} = req.params   // channel id is the id of the user whose subscriber list we want to fetch
    if (!isValidObjectId(channelId)) {
        throw new APIError("Invalid channel ID", 400)
    }
    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "username fullName avatar")
    return res.status(200).json(new APIResponse("Subscriber list fetched successfully", 200, subscribers))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!isValidObjectId(subscriberId)) {
        throw new APIError("Invalid subscriber ID", 400)
    }
    const channels = await Subscription.find({ subscriber: subscriberId }).populate("channel", "username fullName avatar")
    return res.status(200).json(new APIResponse("Subscribed channels fetched successfully", 200, channels))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}