import express from "express";
import "./worker.js"
import { config } from "dotenv";

config();

const app = express();
const PORT = process.env.WORKER_PORT || 3001;

app.get("/", (req, res) => res.send("worker is live"));


app.listen(PORT, () => {
  console.log(`Worker is running on port ${PORT}`);
});