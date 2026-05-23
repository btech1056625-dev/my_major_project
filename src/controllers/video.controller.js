import { asynchandler } from "../utils/asynchandler.js";
import { APIError } from "../utils/apierror.js";
import { APIResponse } from "../utils/apiresponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/Video.model.js";
import { User } from "../models/User.model.js";

// Publish a video
const publishVideo = asynchandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user._id;

    // Step 1: Validate inputs
    if (!title || !title.trim() || !description || !description.trim()) {
        throw new APIError("Title and description are required", 400);
    }

    // Step 2: Validate video file exists
    if (!req.files || !req.files.videoFile) {
        throw new APIError("Video file is required", 400);
    }

    // Step 3: Upload video and thumbnail to Cloudinary
    const videoFile = req.files.videoFile[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    const videoUploadResult = await uploadToCloudinary(videoFile.path);
    const videoUrl = videoUploadResult.secure_url;
    const videoDuration = videoUploadResult.duration;

    if (!videoUrl) {
        throw new APIError("Failed to upload video to Cloudinary", 500);
    }

    let thumbnailUrl = "https://via.placeholder.com/480x360";
    if (thumbnailFile) {
        const thumbnailUploadResult = await uploadToCloudinary(thumbnailFile.path);
        thumbnailUrl = thumbnailUploadResult.secure_url;
    }

    // Step 4: Create video document in database
    const video = await Video.create({
        videoFile: videoUrl,
        thumbnail: thumbnailUrl,
        title: title.trim(),
        description: description.trim(),
        duration: videoDuration,
        owner: userId,
        isPublished: true
    });

    // Step 5: Fetch created video with owner details
    const publishedVideo = await Video.findById(video._id)
        .populate('owner', 'username avatar fullName');

    return res.status(201).json(
        new APIResponse("Video published successfully", 201, publishedVideo)
    );
});

// Get all videos with pagination and filters
const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;

    // Step 1: Build filter object
    const filter = { isPublished: true };

    if (query && query.trim()) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    if (userId) {
        filter.owner = userId;
    }

    // Step 2: Build sort object
    const sortOrder = sortType === "asc" ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    // Step 3: Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Step 4: Fetch videos
    const videos = await Video.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('owner', 'username avatar fullName');

    // Step 5: Get total count for pagination info
    const totalVideos = await Video.countDocuments(filter);

    return res.status(200).json(
        new APIResponse("Videos fetched successfully", 200, {
            videos,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: totalVideos,
                pages: Math.ceil(totalVideos / limitNum)
            }
        })
    );
});

// Get video by ID
const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params;

    // Step 1: Validate video exists
    const video = await Video.findById(videoId)
        .populate('owner', 'username avatar fullName');

    if (!video) {
        throw new APIError("Video not found", 404);
    }

    // Step 2: Increment views
    video.views += 1;
    await video.save();

    // Step 3: Add to user's watch history
    if (req.user) {
        await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { watchHistory: videoId } },
            { new: true }
        );
    }

    return res.status(200).json(
        new APIResponse("Video fetched successfully", 200, video)
    );
});

// Update video details
const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const userId = req.user._id;

    // Step 1: Validate video exists and user is owner
    const video = await Video.findById(videoId);

    if (!video) {
        throw new APIError("Video not found", 404);
    }

    if (video.owner.toString() !== userId.toString()) {
        throw new APIError("You are not authorized to update this video", 403);
    }

    // Step 2: Update fields
    if (title && title.trim()) video.title = title.trim();
    if (description && description.trim()) video.description = description.trim();

    await video.save();

    return res.status(200).json(
        new APIResponse("Video updated successfully", 200, video)
    );
});

// Delete video
const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    // Step 1: Validate video exists and user is owner
    const video = await Video.findById(videoId);

    if (!video) {
        throw new APIError("Video not found", 404);
    }

    if (video.owner.toString() !== userId.toString()) {
        throw new APIError("You are not authorized to delete this video", 403);
    }

    // Step 2: Delete video from database
    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(
        new APIResponse("Video deleted successfully", 200, null)
    );
});

export { publishVideo, getAllVideos, getVideoById, updateVideo, deleteVideo };
    

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