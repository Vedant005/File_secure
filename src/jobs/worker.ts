import { Worker } from "bullmq";
import { connection } from "./queue";
import { prisma } from "../prisma";
import * as fs from "fs";
import * as crypto from "crypto";

new Worker("fileQueue", async (job) => {
  const { fileId } = job.data;
  const file = await prisma.file.findUnique({ where: { id: fileId } });

  if (!file) return;

  await prisma.file.upadte({ where: { id: fileId } });

  try {
    const fileBuffer = await fs.promises.readFile(file.storage_path);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await prisma.file.update({
      where: { id: fileId },
      data: {
        status: "processed",
        extracted_data: hash,
      },
    });
  } catch (err) {
    console.error("File processing failed", err);
    await prisma.file.update({
      where: { id: fileId },
      data: { status: "failed" },
    });
  }
});
