import mongoose  from "mongoose";

const userschema  = new mongoose.Schema({
    username : {
        type : String,
        required : True,
        lower : True,
        unique : True
    },
    password : {
        type : String,
        required : True,
        lower : True,
        unique : True
    },


} , {timestamps:true})
export const User = new mongoose.model("User" , userschema)