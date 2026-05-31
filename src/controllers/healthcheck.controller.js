import { APIError } from "../utils/apierror.js"
import { APIResponse } from "../utils/Apiresponse.js"
import { asynchandler } from "../utils/asynchandler.js"


const healthcheck = asynchandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    
    
    return res.status(200).json(
        new APIResponse("OK", 200, { message: "Server is healthy" })
    );
});

export {
    healthcheck
    }