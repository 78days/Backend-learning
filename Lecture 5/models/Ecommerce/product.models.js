import mongoose  from "mongoose";

const productschema  = new mongoose.Schema({
    name : {
        type : String,
        required : True,
        
    },
    description : {
        type : String,
        
    },
    price : {
        default : 0,
        type : int

    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "category"

    }

} , {timestamps:true})
export const User = new mongoose.model("User" , productschema)