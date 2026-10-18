import { Router } from "express";
import { asyncHandler } from "../utils/handler.utils.js";
import { login, register } from "../controllers/user.controllers.js";

const router = Router();

router.post("/login", asyncHandler(login));
router.post("/register", asyncHandler(register));

export default router