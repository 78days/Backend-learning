import mongoose from "mongoose"
const patientschema = new mongoose.Schema({
    
} , {timestamps : true})

export const patient = mongoose.model('patient',patientschema)
