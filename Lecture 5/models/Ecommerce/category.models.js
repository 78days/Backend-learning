import mongoose  from "mongoose";

const categoryschema  = new mongoose.Schema({
    username : {
        type : String,
        required : True,
        
    }
   
} , {timestamps:true})
export const User = new mongoose.model("User" , categoryschema)