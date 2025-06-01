import { Worker } from "bullmq";
import { connection } from "./queue";
import { prisma } from "../prisma";
import * as fs from "fs";
import * as crypto from "crypto";

/**
 * BullMQ Worker to process files asynchronously
 *
 * Listens to the "fileQueue" queue and:
 * - Fetches the file by ID from the database
 * - Marks its status as "processing"
 * - Reads the file content from disk
 * - Generates a SHA-256 hash of the file
 * - Stores the hash as `extracted_data` and updates status to "processed"
 * - If an error occurs, sets the status to "failed"
 *
 * @param {object} job - Job data from the queue
 * @param {number} job.data.fileId - ID of the file to be processed
 */
new Worker("fileQueue", async (job) => {
  const { fileId } = job.data;

  // Fetch the file record from the database using Prisma
  const file = await prisma.file.findUnique({ where: { id: fileId } });

  if (!file) return;

  // Update the file's status to "processing" in the database
  await prisma.file.update({
    where: { id: fileId },
    data: { status: "processing" },
  });

  try {
    // Read the contents of the uploaded file from its storage path
    const fileBuffer = await fs.promises.readFile(file.storage_path);

    // Generate a SHA-256 hash of the file contents
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update the file record to mark it as processed and save the extracted hash
    await prisma.file.update({
      where: { id: fileId },
      data: {
        status: "processed",
        extracted_data: hash,
      },
    });
  } catch (err) {
    // If any error occurs during processing, mark the status as "failed"
    await prisma.file.update({
      where: { id: fileId },
      data: { status: "failed" },
    });
  }
});
