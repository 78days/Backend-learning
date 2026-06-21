import mongoose from "mongoose"
const reportschema = new mongoose.Schema({
    
} , {timestamps : true})

export const report = mongoose.model('report',reportschema)
