import fs from "node:fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const fileupload = async (filepath) => {
	try {
		if (!filepath) return null;
		const response = await cloudinary.uploader.upload(filepath, {
			resource_type: "auto",
		});
		fs.unlinkSync(filepath);
		return response;
	} catch (error) {
		if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
		console.log(error);
		return null;
	}
};
