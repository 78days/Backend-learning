import mongoose from "mongoose"

const userschema  = mongoose.Schema({
    username: {
        type : String,
        required: true,
        unique : true,
        lowercase : true

    },
    email : {
        type : String,
        required : true,
        lower : true,
        unique : true
    },
    password : {
        required : [true , "password is required"]
    }
} ,
 {
    timestamps  : true
 })

export const User = mongoose.model("User" , userSchema)