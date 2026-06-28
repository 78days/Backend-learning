import mongoose from "mongoose";

//import user from "../../Lecture 17/models/user.model";
const subscriptionschema = new mongoose.Schema(
	{
		subcriber: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		channel: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{ timestamps: true },
);
export const subscription = mongoose.model("subscription", subscriptionschema);
