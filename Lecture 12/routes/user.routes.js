import { Router } from "express";
import { registeruser } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registeruser);

export default router;