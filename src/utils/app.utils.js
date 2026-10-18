export const appError = (msg, statusCode = 400) => {
  const error = new Error(msg);
  error.statusCode = statusCode;
  throw error;
};

export const convertPrice = (price) => {
 return price * 100;
};

export const filterEventData = (
  title,
  description,
  date,
  location,
  ticketPrice,
  totalTickets,
) => {
  const data = {};

  if (title !== undefined && title.trim() !== "") data.title = title;
  if (description !== undefined && description.trim() !== "")
    data.description = description;
  if (date !== undefined && date.trim() !== "") data.date = date;
  if (location !== undefined && location.trim() !== "")
    data.location = location;
  if (ticketPrice !== undefined && ticketPrice !== "")
    data.ticketPrice = convertPrice(ticketPrice);
  if (totalTickets !== undefined && totalTickets !== "")
    data.totalTickets = totalTickets;

  return data;
};
