import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import userroute from "../routes/user.routes.js";

dotenv.config({
	path: "./.env",
});

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	}),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userroute);

// app.use((req, res) => {
// 	res.status(404).json({
// 		success: false,
// 		message: "Route not found",
// 	});
// });

// app.use((err, req, res, next) => {
// 	const statusCode =
// 		err?.statuscode ||
// 		err?.statusCode ||
// 		(err?.name === "MulterError" ? 400 : 500);
// 	return res.status(statusCode).json({
// 		success: false,
// 		message: err?.message || "Internal Server Error",
// 		errors: err?.errors || [],
// 	});
// });

export { app };
