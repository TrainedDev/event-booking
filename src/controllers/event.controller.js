import {
  createEventService,
  deleteEventService,
  getAllEventsService,
  getEventByIdService,
  updateEventService,
} from "../services/event.services.js";
import { appError, convertPrice, filterEventData } from "../utils/app.utils.js";
import { responseHandler } from "../utils/handler.utils.js";

export const createEvent = async (req, res) => {
  const { title, description, date, location, totalTickets, ticketPrice } =
    req.body;
  const userId = req.userId;

  if (
    !title ||
    !description ||
    !date ||
    !location ||
    !totalTickets ||
    !ticketPrice
  )
    appError("required fields are missing.");

  const price = convertPrice(ticketPrice);

  const response = await createEventService(
    title,
    description,
    date,
    location,
    userId,
    totalTickets,
    price,
  );

  responseHandler(res, 201, response);
};

export const getAllEvents = async (req, res) => {
  const response = await getAllEventsService();

  responseHandler(res, 200, response);
};

export const getEventById = async (req, res) => {
  const { id } = req.params;

  const response = await getEventByIdService(id);

  responseHandler(res, 200, response);
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location, ticketPrice, totalTickets } =
    req.body;
  const userId = req.userId;
  
  if (
    !title ||
    !description ||
    !date ||
    !location ||
    !ticketPrice ||
    !totalTickets
  )
    appError("required fields are missing.");

  const filteredEventData = filterEventData(
    title,
    description,
    date,
    location,
    ticketPrice,
    totalTickets,
  );

  const response = await updateEventService(filteredEventData, id, userId);

  responseHandler(res, 200, response);
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const response = await deleteEventService(id, userId);

  responseHandler(res, 204, response);
};
