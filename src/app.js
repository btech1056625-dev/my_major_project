import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,   // used for sending requests from frontend to backend
    credentials: true                  // used for sending cookies
}))

// Middleware - must be before routes
app.use(express.json({ limit: "16kb" }))  // used for sending JSON data
app.use(express.urlencoded({ extended: true, limit: "16kb" }))  // used for sending from URL
app.use(express.static("public"))    // used for serving static files like css, js, images, etc.
app.use(cookieParser())              // used for sending cookies

// Routes
import userRoutes from "./routes/user.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import videoRoutes from "./routes/video.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import healthRoutes from "./routes/health.routes.js";

// routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1", healthRoutes);



export { app }
