import jwt from "jsonwebtoken";
import user from "../models/user.model.js";
import { apierrorhandler } from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";

export const verifyjwt = asynchandler(async (req, _res, next) => {
	try {
		const token =
			req.cookies?.accesstoken ||
			req.header("Authorization")?.replace("Bearer ", "");
		if (!token) throw new apierrorhandler(401, "unauthorized access");
		const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const founduser = await user
			.findById(decodedtoken?._id)
			.select("-password -refreshtoken");
		if (!founduser) throw new apierrorhandler(401, "invalid access");
		req.user = founduser;
		next();
	} catch (error) {
		throw new apierrorhandler(401, error?.message || "invalid access token");
	}
});
