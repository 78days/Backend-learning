import user from "../models/user.model.js";
import { apierrorhandler } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import asynchandler from "../utils/asynchandler.js";
import { fileupload } from "../utils/cloudinary.js";

export const registeruser = asynchandler(async (req, res) => {
	const { fullname, email, username, password } = req.body;

	const missingfield = [fullname, email, username, password].some(
		(field) => !field || field.trim() === "",
	);
	if (missingfield)
		throw new apierrorhandler(400, "all fields are required");

	const existeduser = await user.findOne({
		$or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
	});
	if (existeduser) throw new apierrorhandler(409, "user already exists");

	const avatarlocalpath = req.files?.avatar?.[0]?.path;
	const coverimagepath = req.files?.coverimage?.[0]?.path;
	if (!avatarlocalpath)
		throw new apierrorhandler(400, "avatar file is required");

	const avatarimage = await fileupload(avatarlocalpath);
	const coverimage = coverimagepath
		? await fileupload(coverimagepath)
		: null;
	if (!avatarimage) throw new apierrorhandler(500, "avatar upload failed");

	const userresponse = await user.create({
		fullname,
		avatar: avatarimage.url,
		coverimage: coverimage?.url || "",
		email: email.toLowerCase(),
		password,
		username: username.toLowerCase(),
	});

	const usercreated = await user
		.findById(userresponse._id)
		.select("-password -refreshtoken");
	if (!usercreated) throw new apierrorhandler(500, "server error");

	return res
		.status(201)
		.json(new apiresponse(201, usercreated, "user created successfully"));
});
