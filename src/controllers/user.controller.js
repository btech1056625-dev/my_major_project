import {asynchandler} from '../utils/asynchandler.js';

const registerUser = asynchandler(async (req, res) => {
    res.status(200).json({
        message: "User registered successfully",
        success: true
    })
})

const loginUser = asynchandler(async (req, res) => {
    res.status(200).json({
        message: "User logged in successfully",
        success: true
    })
})
export {registerUser, loginUser}
