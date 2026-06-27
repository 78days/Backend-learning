import user from "../models/user.model.js";
import { apierrorhandler } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import asynchandler from "../utils/asynchandler.js";
import { fileupload } from "../utils/cloudinary.js";

export const generateaccessandrefreshtoken = async (userid) => {
	try {
		const founduser = await user.findById(userid);
		const accesstoken = founduser.generateaccesstoken();
		const refreshtoken = founduser.generaterefreshtoken();
		founduser.refreshtoken = refreshtoken;
		await founduser.save({ validateBeforeSave: false });
		return { accesstoken, refreshtoken };
	} catch (_error) {
		throw new apierrorhandler(
			500,
			"server error while generating access token",
		);
	}
};

export const registeruser = asynchandler(async (req, res) => {
	const { fullname, email, username, password } = req.body;

	const missingfield = [fullname, email, username, password].some(
		(field) => !field || field.trim() === "",
	);
	if (missingfield) throw new apierrorhandler(400, "all fields are required");

	const existeduser = await user.findOne({
		$or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
	});
	if (existeduser) throw new apierrorhandler(409, "user already exists");

	const avatarlocalpath = req.files?.avatar?.[0]?.path;
	const coverimagepath = req.files?.coverimage?.[0]?.path;
	if (!avatarlocalpath)
		throw new apierrorhandler(400, "avatar file is required");

	const avatarimage = await fileupload(avatarlocalpath);
	const coverimage = coverimagepath ? await fileupload(coverimagepath) : null;
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

export const logoutuser = asynchandler(async (req, res) => {
	await user.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				refreshtoken: undefined,
			},
		},
		{
			new: true,
		},
	);
	const options = {
		httpOnly: true,
		secure: true,
	};
	return res
		.status(200)
		.clearCookie("accesstoken", options)
		.clearCookie("refreshtoken", options)
		.json(new apiresponse(200, {}, "user logged out"));
});

export const loginuser = asynchandler(async (req, res) => {
	const { email, username, password } = req.body;
	if ((!username && !email) || !password)
		throw new apierrorhandler(400, "username or email is required");
	const usercheck = await user.findOne({
		$or: [{ username }, { email }],
	});
	if (!usercheck) throw new apierrorhandler(404, "user does not exist");
	const ispasswordvalid = await usercheck.ispasswordcorrect(password);
	if (!ispasswordvalid)
		throw new apierrorhandler(401, "invalid user credentials");
	const { accesstoken, refreshtoken } = await generateaccessandrefreshtoken(
		usercheck._id,
	);
	const loggedinuser = await user
		.findById(usercheck._id)
		.select("-password -refreshtoken");
	const options = {
		httpOnly: true,
		secure: true,
	};
	return res
		.status(200)
		.cookie("accesstoken", accesstoken, options)
		.cookie("refreshtoken", refreshtoken, options)
		.json(
			new apiresponse(
				200,
				{
					user: loggedinuser,
					accesstoken,
					refreshtoken,
				},
				"user logged in successfully",
			),
		);
});
