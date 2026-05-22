import { asynchandler } from "../utils/asynchandler";
import { APIError } from "../utils/apierror.js";
import { APIResponse } from "../utils/apiresponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/User.model.js";
import { Video } from "../models/Video.model.js";
import { Tweet } from "../models/tweet.model.js";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const filter = {}
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const videoFile = req.file
    const thumbnail = req.file
    if (!videoFile) {
        throw new APIError("Video file is required", 400)
    }
    const uploadResult = await uploadToCloudinary(videoFile.path)
    const videoUrl = uploadResult.secure_url
    const thumbnailUploadResult = await uploadToCloudinary(thumbnail.path)
    const thumbnailUrl = thumbnailUploadResult.secure_url
    const duration = uploadResult.duration //TODO: get video duration
    const video = await Video.create({
        videoFile: videoUrl,
        thumbnail: thumbnailUrl,
        title,
        description,
        duration,
        owner: req.user._id
    })
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId).populate("owner", "username fullName avatar")
    if (!video) {
        throw new APIError("Video not found", 404)
    }
    res.status(200).json(new APIResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body
    const video = await Video.findById(videoId)
    if (!video) {
        throw new APIError("Video not found", 404)
    }
    // Check if the user is the owner of the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new APIError("Only the owner can update the video", 403)
    }
    // Update video details
    video.title = title
    video.description = description
    await video.save()
    res.status(200).json(new APIResponse(200, video, "Video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video = await Video.findById(videoId)
    if (!video) {
        throw new APIError("Video not found", 404)
    }
    // Check if the user is the owner of the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new APIError("Only the owner can delete the video", 403)
    }
    // Delete the video
    await Video.findByIdAndDelete(videoId)
    res.status(200).json(new APIResponse(200, null, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle publish status of the video
    const video = await Video.findById(videoId)
    if (!video) {
        throw new APIError("Video not found", 404)
    }
    // Check if the user is the owner of the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new APIError("Only the owner can change the publish status of the video", 403)
    }
    video.isPublished = !video.isPublished
    await video.save()
    res.status(200).json(new APIResponse(200, video, "Publish status updated successfully"))
    const uploadVideo = asyncHandler(async(req,res) => {
        const {title, description} = req.body
        const videoFile = req.files?.videoFile[0]
        const thumbnail = req.files?.thumbnail[0]

        if(!videoFile){
            throw new APIError(400,"Video file is required")
        }

        const video = await Video.create({
            title,
            description,
            videoFile : videoFile.path,
            thumbnail : thumbnail.path,
            owner : req.user._id
        })

        return res.status(200).json(
            new APIResponse(200,video,"Video uploaded successfully")
        )
    })
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}  


export {uploadVideo, getVideo}