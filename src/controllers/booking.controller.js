import {
  createBookingService,
  fetchCustomerBookingsService,
} from "../services/booking.service.js";
import { appError } from "../utils/app.utils.js";
import { responseHandler } from "../utils/handler.utils.js";

export const createBooking = async (req, res) => {
  const { totalBuyingTickets, eventId } = req.body;
  const userId = req.userId;

  if (!totalBuyingTickets  || !eventId)
    appError("required details not found");

  const response = await createBookingService(
    totalBuyingTickets,
    eventId,
    userId,
  );

  responseHandler(res, 200, response);
};

export const fetchCustomerBookings = async (req, res) => {
  const userId = req.userId;

  const response = await fetchCustomerBookingsService(userId);

  responseHandler(res, 200, response);
};
