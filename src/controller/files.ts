import { Request, Response, RequestHandler } from "express";
import { prisma } from "../prisma";
import { fileQueue } from "../jobs/queue";

// Upload File
/**
 * Handle file upload by an authenticated user and enqueue it for processing
 * @param {Request} req - Express request object containing the file and metadata (title, description)
 * @param {Response} res - Express response object returning file ID and upload status
 */
export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const { title, description } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const newFile = await prisma.file.create({
      data: {
        userId,
        original_filename: file.originalname,
        storage_path: file.path,
        title,
        description,
        status: "uploaded",
      },
    });

    // BullMQ queue
    await fileQueue.add("processFile", { fileId: newFile.id });

    res.status(201).json({ fileId: newFile.id, status: "uploaded" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get File Status
/**
 * Fetch the status and metadata of a user's uploaded file
 * @param {Request} req - Express request object with the file ID as a route param
 * @param {Response} res - Express response object returning file details and processing status
 */
export const getFileStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const fileId = Number(req.params.id);

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== userId) {
      res.status(404).json({ error: "File not found or unauthorized" });
      return;
    }

    res.json({
      id: file.id,
      title: file.title,
      description: file.description,
      status: file.status,
      extracted_data: file.extracted_data,
      uploaded_at: file.uploaded_at,
      original_filename: file.original_filename,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
