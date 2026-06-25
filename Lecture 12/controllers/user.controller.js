import asynchandler from "../utils/asynchandler.js";

export const registeruser = asynchandler(async (req, res) => {
    return res.status(200).json({
        message: "Server is running",
    });
});