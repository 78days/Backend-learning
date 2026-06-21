import mongoose from 'mongoose'

const todoschema = mongoose.Schema({
    content : {
        type : string ,
        required : true,

    },
    createdby : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    subtodo : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "subtodomodel"
    }]
} , { timestamps : true})


export const todo = mongoose.model('todo' , todoschema)