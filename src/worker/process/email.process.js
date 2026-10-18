import { config } from "dotenv";
import transporter from "../config/email.config.js";

config();

export const processEmail = async ({
  email,
  username,
  eventTitle,
  totalBuyingTickets,
  totalTicketsPrice,
  totalTickets,
  ticketPrice,
  update = false,
}) => {
  if (!email) {
    throw new Error("Customer email is missing");
  }

  const subject = update
    ? "Important: Event Updated"
    : "Your Event Booking Is Confirmed";

  const text = update
    ? `
Hello ${username},

The organizer has updated the event you are interested in.

Event: ${eventTitle}
Total tickets available: ${totalTickets}
Ticket price: ₹${ticketPrice}

Please check the latest event details before attending.

Thank you,
Event Booking Team
`
    : `
Hello ${username},

Your booking was successful!

Event: ${eventTitle}
Tickets booked: ${totalBuyingTickets}
Total price: ₹${totalTicketsPrice}

Thank you for booking with us!
`;

  const info = await transporter.sendMail({
    from: `"Event Booking" <${process.env.SMTP_FROM}>`,
    to: email,
    subject,
    text,
  });

  console.log(
    `${update ? "Event update" : "Booking confirmation"} email accepted:`,
    info.messageId,
  );

  return { messageId: info.messageId };
};
