import "dotenv/config"; 
import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "./constants.js";
import connectDB from "../db/index.js";
const app = express();

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log('hi')
    })
})
.catch((err) => {
    console.log(err)
} )
