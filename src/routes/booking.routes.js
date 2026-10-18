import { Router } from "express";
import { asyncHandler } from "../utils/handler.utils.js";
import {
  createBooking,
  fetchCustomerBookings,
} from "../controllers/booking.controller.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/create", verifyUser, asyncHandler(createBooking));
router.get("/", verifyUser, asyncHandler(fetchCustomerBookings));

export default router;
