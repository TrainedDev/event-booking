import { Worker } from "bullmq";
import connection from "./config/ioredis.config.js";
import { processEmail } from "./process/email.process.js";

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("processing email job:", job.id);

    return await processEmail(job.data);
  },
  {
    connection,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, error) => {
  console.error(
    `Email job ${job?.id} failed:`,
    error.message
  );
});

console.log("Email worker is processing");
