import express from "express";
import cors from "cors";
import db from "./models/index.cjs";
import userRoutes from "./routes/user.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import eventRoutes from "./routes/event.routes.js";
import { errorHandler } from "./utils/handler.utils.js";

const app = express();
const { sequelize } = db;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("server is live"));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/event", eventRoutes);

app.use(errorHandler);
sequelize
  .authenticate()
  .then(() => {
    console.log("successfully connected to database.");
  })
  .catch((err) => {
    console.error("failed to connect to database:", err);
  });

export default app;
