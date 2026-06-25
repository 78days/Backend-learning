import "dotenv/config";
import connectDB from "../db/index.js";
import { app } from "./app.js";
import { DB_NAME } from "./constants.js";



connectDB()
	.then(() => {
		app.listen(process.env.PORT || 8000, () => {
			console.log(`Server running on port ${process.env.PORT || 8000}`);
			console.log("hi");
		});
	})
	.catch((err) => {
		console.log(err);
	});


