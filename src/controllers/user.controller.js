import { asynchandler } from '../utils/asynchandler.js';
import { User } from '../models/User.model.js';
import { APIError } from '../utils/apierror.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { APIResponse } from '../utils/apiresponse.js';

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

export { registerUser, loginUser };
