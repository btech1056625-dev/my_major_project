import {Subscription} from "../models/subscription.model.js" 
import {asynchandler} from '../utils/asynchandler.js';

const subscribeToChannel = asynchandler(async (req, res) => {
    return res.status(200).json({
        message: "Subscribed to channel successfully",
        success: true
    })
})  
export {subscribeToChannel}