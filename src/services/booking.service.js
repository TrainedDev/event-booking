import db from "../models/index.cjs";
import { emailQueue } from "../queues/email.queues.js";
import { appError, convertPrice } from "../utils/app.utils.js";

const { Event, User, sequelize, Booking } = db;

export const createBookingService = async (totalBuyingTickets, id, userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    appError("Customer not found");
  }

  const response = await sequelize.transaction(async (t) => {
    const event = await Event.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!event) {
      appError("Event not found");
    }

    if (event.totalTickets <= 0) {
      appError("Out of tickets");
    }

    if (totalBuyingTickets > event.totalTickets) {
      appError(`Ticket limit exceeded. Available: ${event.totalTickets}`);
    }

    const price = convertPrice(totalBuyingTickets * event.ticketPrice);

    await event.update(
      {
        totalTickets: event.totalTickets - totalBuyingTickets,
      },
      { transaction: t },
    );

    const bookingData = await Booking.create(
      {
        totalBuyingTickets,
        totalTicketsPrice: price,
        eventId: id,
        userId,
      },
      { transaction: t },
    );

    return {
      bookingData,
      eventName: event.title,
    };
  });

  await emailQueue.add(
    "booking-confirmation",
    {
      email: user.email,
      username: user.username,
      eventTitle: response.eventName,
      totalBuyingTickets,
      totalTicketsPrice: response.bookingData.totalTicketsPrice / 100,
      update: false,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  );

  return {
    msg: "Ticket successfully booked",
    data: response.bookingData,
  };
};

export const fetchCustomerBookingsService = async (id) => {
  const fetchBookings = await User.findByPk(id, {
    include: [
      {
        model: Booking,
        attributes: { exclude: ["password"] },
        as: "customerBookings",
      },
    ],
  });

  return { msg: "customer booking successfully fetched", data: fetchBookings };
};
