import db from "../models/index.cjs";
import { emailQueue } from "../queues/email.queues.js";

const { Event, User, Booking } = db;

export const createEventService = async (
  title,
  description,
  date,
  location,
  userId,
  totalTickets,
  ticketPrice,
) => {
  const newEvent = await Event.create({
    title,
    description,
    date,
    location,
    userId,
    totalTickets,
    ticketPrice,
  });

  return { msg: "event successfully created", data: newEvent };
};

export const getAllEventsService = async () => {
  const fetchEvents = await Event.findAll();

  return { msg: "events successfully fetched", data: fetchEvents };
};

export const getEventByIdService = async (id) => {
  const fetchEvent = await Event.findByPk(id, {
    include: [
      {
        model: User,
        attributes: { exclude: ["password"] },
        as: "event_organizer",
      },
    ],
  });

  return { msg: "event successfully fetched", data: fetchEvent };
};

export const updateEventService = async (data, eventId, id) => {
  const [updatedCount, updatedEventData] = await Event.update(data, {
    where: { id: eventId },
    returning: true,
  });

  if (updatedCount === 0) {
    appError("Event not found");
  }

  const eventData = updatedEventData[0];

  const bookings = await Booking.findAll({
    where: { eventId },
    include: [
      {
        model: User,
        as: "customer",
        attributes: ["id", "email", "username"],
      },
    ],
  });

  const jobs = bookings
    .filter((booking) => booking.customer?.email)
    .map((booking) => ({
      name: "event-update",
      data: {
        email: booking.customer.email,
        username: booking.customer.username,
        eventTitle: eventData.title,
        totalTickets: eventData.totalTickets,
        ticketPrice: eventData.ticketPrice / 100,
        update: true,
      },
      opts: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }));

  if (jobs.length > 0) {
    await emailQueue.addBulk(jobs);
  }

  return {
    msg: "Event successfully updated",
    data: eventData,
    notifiedCustomers: jobs.length,
  };
};

export const deleteEventService = async (id) => {
  await Event.destroy({ where: { id } });

  return { msg: "event successfully deleted" };
};
