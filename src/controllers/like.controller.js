import { asynchandler } from "../utils/asynchandler";

const uploadVideo = asynchandler(async (req, res) => {
    res.status(200).json({
        message: "Video uploaded successfully",
        success: true
    })
})

const getVideo = asynchandler(async (req, res) => {
    res.status(200).json({
        message: "Video fetched successfully",
        success: true
    })
})  