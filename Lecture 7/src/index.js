import "dotenv/config"; 
import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "./constants.js";

const app = express();
( async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        
        // app.listen(process.env.PORT , () =>{
        //     console.log("app running on")
        // })
        console.log(connection)
    } catch (error) {
        console.log(error)
        throw error
        
    }
    

} )()