require("dotenv").config({path : './env'})

import connectDB from "../db";

import cors from "cors"
import cookieparser from "cookie-parser"
export const app = express()
// connectDB()
// .then( () => {
    
// })
// .catch(err){
//     console.log(err)
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
// }
