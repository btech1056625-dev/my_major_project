import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// DB is in another continent so it will take time to connect
// DB can be on cloud as well as on local server

export async function connectDB() {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected at :${connectionInstance.connection.host}`)
        console.log("Database Name: ", connectionInstance.connection.name)
    }
    catch (error) {
        console.log("ERROR in connection to MongoDB : ", error);
        process.exit(1)
    }
}
