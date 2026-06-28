//import user from "../models/user.model.js";

import jwt from "jsonwebtoken";
import user from "../models/user.model.js";
import { _Options } from "../src/constants.js";
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

	return res
		.status(200)
		.clearCookie("accesstoken", _Options)
		.clearCookie("refreshtoken", _Options)
		.json(new apiresponse(200, {}, "user logged out"));
});

export const loginuser = asynchandler(async (req, res) => {
	const { email, username, password } = req.body;
	if ((!username && !email) || !password)
		throw new apierrorhandler(400, "username or email is required");
	const usercheck = await user.findOne({
		$or: [
			{ username: username?.toLowerCase() },
			{ email: email?.toLowerCase() },
		],
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

	return res
		.status(200)
		.cookie("accesstoken", accesstoken, _Options)
		.cookie("refreshtoken", refreshtoken, _Options)
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

export const accessrefreshtoken = asynchandler(async (req, res) => {
	const incomingrefreshtoken =
		req.body.refreshtoken || req.cookies.refreshtoken;
	if (!incomingrefreshtoken) throw new apierrorhandler(401, "no refresh token");
	try {
		const decodedtoken = jwt.verify(
			incomingrefreshtoken,
			process.env.REFRESH_TOKEN_SECRET,
		);

		const usertokenfromdb = await user.findById(decodedtoken?._id);
		if (!usertokenfromdb) throw new apierrorhandler(401, "invalid token");

		if (incomingrefreshtoken !== usertokenfromdb?.refreshtoken)
			throw new apierrorhandler(401, "invalid token");
		const { accesstoken, refreshtoken } = await generateaccessandrefreshtoken(
			usertokenfromdb._id,
		);
		return res
			.status(200)
			.cookie("accesstoken", accesstoken, _Options)
			.cookie("refreshtoken", refreshtoken, _Options)
			.json(
				new apiresponse(
					200,
					{
						accesstoken: accesstoken,
						refreshtoken: refreshtoken,
					},
					"access and refresh token generated successfully",
				),
			);
	} catch (error) {
		throw new apierrorhandler(401, error?.message || "invalid refresh token ");
	}
});

export const changepassword = asynchandler(async (req, res) => {
	const { oldpassword, newpassword } = req.body;
	if (!oldpassword || !newpassword)
		throw new apierrorhandler(400, "all fields are required");

	const userid = await user.findById(req.user?._id);
	if (!userid) throw new apierrorhandler(404, "user not found");

	const ispasswordcorr = await userid.ispasswordcorrect(oldpassword);
	if (!ispasswordcorr) throw new apierrorhandler(401, "wrong password");
	userid.password = newpassword;
	await userid.save({ validateBeforeSave: false });
	return res
		.status(200)
		.json(new apiresponse(200, {}, "password changed successfully"));
});

export const getcurrentuser = asynchandler(async (req, res) => {
	return res
		.status(200)
		.json(new apiresponse(200, req?.user, "user get successfully"));
});

export const updateuser = asynchandler(async (req, res) => {
	const { fullname, email } = req.body;
	if (!fullname || !username)
		throw new apierrorhandler(401, "enter  both email and fullname");
	const User = user.findByIdAndUpdate(
		req?.user?._id,
		{
			$set: {
				fullname,
				email: email,
			},
		},
		{ new: true },
	);
	return res
		.status(200)
		.json(
			new apiresponse(
				200,
				User.select("-password"),
				"user updated successfully",
			),
		);
});

export const updateavater = asynchandler(async (req, res) => {
	const avaterfilepath = req.file?.path;
	if (!avaterfilepath) throw new apierrorhandler(401, "avatar not uploaded");
	const avatarresponse = fileupload(avaterfilepath);
	if (!avatarresponse)
		throw new apierrorhandler(501, "avatar not uploaded on cloudinary");

	const User = user.findByIdAndUpdate(
		req?.user?._id,
		{
			$set: {
				avatar: avatarresponse.url,
			},
		},
		{ new: true },
	);
	return res
		.status(200)
		.json(
			new apiresponse(
				200,
				User.select("-password"),
				"avatar updated successfully",
			),
		);
});

export const updatecoverimage = asynchandler(async (req, res) => {
	const coverimagefilepath = req.file?.path;
	if (!coverimagefilepath)
		throw new apierrorhandler(401, "cover image not uploaded");
	const coverimagerespone = fileupload(coverimagefilepath);
	if (!coverimagerespone)
		throw new apierrorhandler(501, "cover image not uploaded on cloudinary");

	const User = user.findByIdAndUpdate(
		req?.user?._id,
		{
			$set: {
				coverimage: coverimagerespone.url,
			},
		},
		{ new: true },
	);
	return res
		.status(200)
		.json(
			new apiresponse(
				200,
				User.select("-password"),
				"cover image updated successfully",
			),
		);
});
