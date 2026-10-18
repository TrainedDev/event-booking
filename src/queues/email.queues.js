import { Queue } from "bullmq";
import connection from "../config/ioredis.config.js";

export const emailQueue = new Queue("emailQueue", { connection });
