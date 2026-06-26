import asynchandler from "../utils/asynchandler.js";

export const registeruser = asynchandler(async (req, res) => {
   
    const {fullname , email , username} = req.body

    console.log(fullname,email)
});

