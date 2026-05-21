import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        isLiked: {
            type: Boolean,
            default: false
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        }
    },
    { timestamps: true }
)

export const Like = mongoose.model("Like", likeSchema)