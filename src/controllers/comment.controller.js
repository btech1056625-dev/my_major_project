import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const comments = await Comment.find({video: videoId})
        .skip((page - 1) * limit)
        .limit(limit)

    return res.status(200).json(
        new ApiResponse("Comments fetched successfully", 200, comments)
    );
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    if (!content || content.trim() === "") {
        throw new ApiError("Content is required", 400)
    }   
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id // Assuming you have authentication middleware that sets req.user
    })
    return res.status(201).json(
        new ApiResponse("Comment added successfully", 201, comment)
    );
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body

    if (!content || content.trim() === "") {
        throw new ApiError("Content is required", 400)
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
    )

    if (!comment) {
        throw new ApiError("Comment not found", 404)
    }

    return res.status(200).json(
        new ApiResponse("Comment updated successfully", 200, comment)
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    const comment = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
        throw new ApiError("Comment not found", 404)
    }
    return res.status(200).json(
        new ApiResponse("Comment deleted successfully", 200, comment)
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}
