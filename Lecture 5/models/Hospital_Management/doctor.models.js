import mongoose from "mongoose"
const doctorschema = new mongoose.Schema({
    
} , {timestamps : true})

export const doctor = mongoose.model('doctor',doctorschema)
