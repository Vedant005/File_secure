import { Queue } from "bullmq";
import IORedis from "ioredis";

export const connection = new IORedis("redis://localhost:6379");

// Creating a queue andexporting
export const fileQueue = new Queue("fileQueue", { connection });
