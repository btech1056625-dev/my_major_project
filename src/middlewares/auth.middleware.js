import jwt from "jsonwebtoken";
import { APIError } from "../utils/apierror.js";
import { User } from "../models/User.model.js";
import { asynchandler } from "../utils/asynchandler.js";

// ---------------------------------------------------------------------------
// Helper — extract raw token from request
// Priority: Authorization header (Bearer) → httpOnly cookie
// ---------------------------------------------------------------------------
const extractToken = (req) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }
    if (req.cookies?.accessToken) {
        return req.cookies.accessToken;
    }
    return null;
};

// ---------------------------------------------------------------------------
// verifyJWT — strict guard for protected routes
// Rejects the request with 401 if no valid token is present.
// ---------------------------------------------------------------------------
const verifyJWT = asynchandler(async (req, _res, next) => {
    const token = extractToken(req);

    if (!token) {
        throw new APIError("Access denied. Please log in to continue.", 401);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // Fetch the full user so controllers have access to all fields
    const user = await User.findById(decoded._id).select("-password -refreshToken");

    if (!user) {
        throw new APIError("Invalid access token — user no longer exists.", 401);
    }

    req.user = user;
    next();
});

// ---------------------------------------------------------------------------
// optionalAuth — non-blocking enrichment for public routes
// Populates req.user when a valid token is present but never rejects the
// request — unauthenticated callers proceed normally with req.user = null.
// ---------------------------------------------------------------------------
const optionalAuth = asynchandler(async (req, _res, next) => {
    const token = extractToken(req);

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password -refreshToken");
        req.user = user || null;
    } catch {
        // Invalid / expired token on a public route — silently ignore
        req.user = null;
    }

    next();
});

export { verifyJWT, optionalAuth };
