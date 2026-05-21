import { asynchandler } from "../utils/asynchandler";
const createTweet = asynchandler(async (req, res) => {
    res.status(200).json({
        message: "Tweet created successfully",
        success: true
    })
})  
export {createTweet}