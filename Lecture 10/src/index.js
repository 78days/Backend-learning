import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import connectDB from "../db/index.js";
import { DB_NAME } from "./constants.js";

const app = express();

connectDB()
	.then(() => {
		app.listen(process.env.PORT || 8000, () => {
			console.log("hi");
		});
	})
	.catch((err) => {
		console.log(err);
	});
