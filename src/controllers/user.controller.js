import { asynchandler } from '../utils/asynchandler.js';
import { User } from '../models/User.model.js';
import { APIError } from '../utils/apierror.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { APIResponse } from '../utils/apiresponse.js';
import { Playlist } from '../models/playlist.model.js';

const registerUser = asynchandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;

    // Step 1: Validate all required fields
    if ([username, email, fullName, password].some(field => !field || field.toString().trim() === "")) {
        throw new APIError("All fields (username, email, fullName, password) are required", 400);
    }

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
        throw new APIError("User with this email or username already exists", 409);
    }

    // Step 3: Handle file uploads to Cloudinary
    let avatarUrl, coverImageUrl;

    if (req.files && req.files.avatar) {
        const avatarFile = req.files.avatar[0];
        const avatarUploadResult = await uploadToCloudinary(avatarFile.path);
        avatarUrl = avatarUploadResult.secure_url;
    } else {
        throw new APIError("Avatar image is required", 400);
    }

    if (req.files && req.files.coverImage) {
        const coverImageFile = req.files.coverImage[0];
        const coverImageUploadResult = await uploadToCloudinary(coverImageFile.path);
        coverImageUrl = coverImageUploadResult.secure_url;
    } else {
        throw new APIError("Cover image is required", 400);
    }

    // Step 4: Create new user in database
    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        fullName,
        password,
        avatar: avatarUrl,
        coverImage: coverImageUrl
    });

    // Step 5: Fetch created user without sensitive data
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new APIError("Failed to create user account", 500);
    }

    // Step 6: Return success response
    return res.status(201).json(
        new APIResponse("User registered successfully", 201, createdUser)
    );
});

const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    // Step 1: Validate credentials are provided
    if ([email, password].some(field => !field || field.toString().trim() === "")) {
        throw new APIError("Email and password are required", 400);
    }

    // Step 2: Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new APIError("Invalid email or password", 401);
    }

    // Step 3: Verify password
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new APIError("Invalid email or password", 401);
    }

    // Step 4: Generate access token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Step 5: Update user with refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Step 6: Fetch user data without sensitive info
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Step 7: Return success response with tokens
    return res.status(200).json(
        new APIResponse("User logged in successfully", 200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        })
    );
});

// Get user's liked videos
const getUserLikedVideos = asynchandler(async (req, res) => {
    const { userId } = req.params;

    // Step 1: Fetch user with liked videos populated
    const user = await User.findById(userId)
        .populate({
            path: 'likedVideos',
            populate: { path: 'owner', select: 'username avatar' }
        });

    if (!user) {
        throw new APIError("User not found", 404);
    }

    return res.status(200).json(
        new APIResponse("User liked videos fetched", 200, {
            totalLiked: user.likedVideos.length,
            likedVideos: user.likedVideos
        })
    );
});

// Get user's liked playlist
const getUserLikedPlaylist = asynchandler(async (req, res) => {
    const { userId } = req.params;

    // Step 1: Fetch user
    const user = await User.findById(userId).select('likedPlaylist');

    if (!user) {
        throw new APIError("User not found", 404);
    }

    // Step 2: Fetch liked playlist with video details
    const likedPlaylist = await Playlist.findById(user.likedPlaylist)
        .populate({
            path: 'videos',
            populate: { path: 'owner', select: 'username avatar' }
        });

    if (!likedPlaylist) {
        return res.status(200).json(
            new APIResponse("No liked playlist created yet", 200, null)
        );
    }

    return res.status(200).json(
        new APIResponse("Liked playlist fetched", 200, likedPlaylist)
    );
});

// Get user profile
const getUserProfile = asynchandler(async (req, res) => {
    const { userId } = req.params;

    // Step 1: Fetch user profile
    const user = await User.findById(userId)
        .select('-password -refreshToken')
        .populate({
            path: 'watchHistory',
            options: { limit: 10 }
        });

    if (!user) {
        throw new APIError("User not found", 404);
    }

    // Step 2: Get user stats
    const likedVideosCount = user.likedVideos.length;
    const watchHistoryCount = user.watchHistory.length;

    return res.status(200).json(
        new APIResponse("User profile fetched", 200, {
            user,
            stats: {
                likedVideos: likedVideosCount,
                watchHistory: watchHistoryCount
            }
        })
    );
});

export { registerUser, loginUser, getUserLikedVideos, getUserLikedPlaylist, getUserProfile };
