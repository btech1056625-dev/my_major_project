import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/User.model.js"
import { APIError } from "../utils/apierror.js"
import { APIResponse } from "../utils/Apiresponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const createTweet = asynchandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if (!content || content.trim() === "") {
        throw new APIError("Content is required", 400)
    }   
    const tweet = await Tweet.create({
        content,
        owner: req.user._id // Assuming you have authentication middleware that sets req.user
    })
    return res.status(201).json(new APIResponse("Tweet created successfully", 201, tweet))
})

const getUserTweets = asynchandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    if (!isValidObjectId(userId)) {
        throw new APIError("Invalid user ID", 400)
    }
    const tweets = await Tweet.find({ owner: userId })
    return res.status(200).json(new APIResponse("Tweets fetched successfully", 200, tweets))
})

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    if (!content || content.trim() === "") {
        throw new APIError("Content is required", 400)
    }
    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {content},
        {new: true}
    )
    return res.status(200).json(new APIResponse("Tweet updated successfully", 200, tweet))
})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    const tweet = await Tweet.findByIdAndDelete(tweetId)
    return res.status(200).json(new APIResponse("Tweet deleted successfully", 200, tweet))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}