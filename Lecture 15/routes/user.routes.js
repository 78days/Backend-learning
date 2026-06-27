import { Router } from "express";
import {
	loginuser,
	logoutuser,
	registeruser,
} from "../controllers/user.controller.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
	"/register",
	upload.fields([
		{
			name: "avatar",
			maxCount: 1,
		},
		{
			name: "coverimage",
			maxCount: 1,
		},
	]),
	registeruser,
);
router.route("/login").post(loginuser);
router.route("/logout").post(verifyjwt, logoutuser);

export default router;
