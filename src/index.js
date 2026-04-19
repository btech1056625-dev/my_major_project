import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})
import { app } from "./app.js"

import express from "express";
const app = express();
import { connectDB } from "./db/db_connect.js";


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
        app.on("error", (error) => {
            console.log("ERROR in connection to MongoDB : ", error);
        })
    })
    .catch((error) => {
        console.log("ERROR in connection to MongoDB : ", error);
    })