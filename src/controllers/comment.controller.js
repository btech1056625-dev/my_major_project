import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { APIError } from "../utils/apierror.js"
import { APIResponse } from "../utils/Apiresponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const getVideoComments = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new APIError("Invalid video ID", 400);
    }

    const comments = await Comment.find({ video: videoId })
        .skip((page - 1) * limit)
        .limit(limit);

    return res.status(200).json(
        new APIResponse("Comments fetched successfully", 200, comments)
    );
});

const addComment = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new APIError("Invalid video ID", 400);
    }

    if (!content || content.trim() === "") {
        throw new APIError("Content is required", 400);
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    return res.status(201).json(
        new APIResponse("Comment added successfully", 201, comment)
    );
});

const updateComment = asynchandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new APIError("Invalid comment ID", 400);
    }

    if (!content || content.trim() === "") {
        throw new APIError("Content is required", 400);
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
    )

    if (!comment) {
        throw new APIError("Comment not found", 404)
    }

    return res.status(200).json(
        new APIResponse("Comment updated successfully", 200, comment)
    )
})

const deleteComment = asynchandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new APIError("Invalid comment ID", 400);
    }

    const comment = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
        throw new APIError("Comment not found", 404)
    }
    return res.status(200).json(
        new APIResponse("Comment deleted successfully", 200, comment)
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}
