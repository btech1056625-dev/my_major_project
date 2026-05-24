import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

});

const uploadToCloudinary = async (filePath, folder) => {
    try {
        if (!filePath) { return null; }
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            folder: folder
        });
        console.log("File uploaded to Cloudinary:", result.secure_url);
        try {
            const absolutePath = path.resolve(filePath);
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        } catch (deleteError) {
            console.warn("Could not delete temporary file:", deleteError.message);
        }
        return result;
    } catch (error) {
        try {
            const absolutePath = path.resolve(filePath);
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        } catch (deleteError) {
            console.warn("Could not delete temporary file after failure:", deleteError.message);
        }
        throw error;
    }
};

export {uploadToCloudinary};