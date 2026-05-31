import jwt from "jsonwebtoken";
import { APIError } from "../utils/apierror.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "default_secret");
        req.user = decoded;
        return next();
    } catch (error) {
        return next(new APIError("Invalid or expired token", 401));
    }
};

export { authMiddleware };
