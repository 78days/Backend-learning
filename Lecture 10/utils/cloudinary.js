import fs from "node:fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRETS,
});

export const fileupload = async (filepath) => {
	try {
		if (!filepath) return null;
		const response = await cloudinary.v2.uploader
			.upload(filepath, {
				resource_type: "video",
				overwrite: true,
			})
			.then((result) => console.log(result));
		return response;
	} catch (error) {
		fs.unlinkSync(filepath);
		console.log(error);
		return null;
	}
};
