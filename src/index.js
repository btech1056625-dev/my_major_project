import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

import express from "express";
const app = express();
import { connectDB } from "./db/db_connect.js";
import { DB_NAME } from "./constants.js";

connectDB()
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("ERROR in connection to MongoDB : ", error);
    })