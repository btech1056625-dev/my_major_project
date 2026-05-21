import {ayschandler} from '../utils/ayschandler.js';

const registerUser = ayschandler(async (req, res) => {
    res.status(200).json({
        message: "User registered successfully",
        success: true
    })
})

const loginUser = ayschandler(async (req, res) => {
    res.status(200).json({
        message: "User logged in successfully",
        success: true
    })
})
export {registerUser, loginUser}
