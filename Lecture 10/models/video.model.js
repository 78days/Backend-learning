import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoschema = new mongoose.Schema(
	{
		videofile: {
			type: String,
			required: true,
		},
		thumbnaail: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: String,
			required: true,
		},

		views: {
			type: Number,
			default: 0,
		},
		ispublished: {
			type: Boolean,
			default: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{ timestamps: true },
);
export const video = mongoose.model("user", videoschema);
