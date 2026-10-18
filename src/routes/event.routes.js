import { Router } from "express";
import { asyncHandler } from "../utils/handler.utils.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "../controllers/event.controller.js";
import { verifyRole, verifyUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/", asyncHandler(getAllEvents));
router.post("/create", verifyUser, verifyRole, asyncHandler(createEvent));
router
  .route("/:id")
  .get(asyncHandler(getEventById))
  .patch(verifyUser, verifyRole, asyncHandler(updateEvent))
  .delete(verifyUser, verifyRole, asyncHandler(deleteEvent));

export default router;
