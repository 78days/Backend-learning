import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userschema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		fullname: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		avatar: {
			type: String,
			required: true,
		},
		coverimage: {
			type: String,
		},
		watchhistory: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "video",
			},
		],
		password: {
			required: [true, "password is required"],
			type: String,
		},
		refreshtoken: {
			type: String,
		},
	},
	{ timestamps: true },
);

userschema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 10);
});

userschema.methods.ispasswordcorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};
userschema.methods.generateaccesstoken = function () {
	return jwt.sign(
		{
			_id: this._id,
			username: this.username,
			email: this.email,
			fullname: this.fullname,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		},
	);
};

userschema.methods.generaterefreshtoken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		},
	);
};

const user = mongoose.model("user", userschema);
export default user;
