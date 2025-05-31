import { Request, Response } from "express";
import { prisma } from "../prisma";
import { fileQueue } from "../jobs/queue";

export const uploadFile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const file = req.file;
  const { title, description } = req.body;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
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

    await fileQueue.add("processFile", { fileId: newFile.id });

    res.status(201).json({ fileId: newFile.id, status: "uploaded" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFileStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const fileId = Number(req.params.id);

  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!file || file.userId !== userId) {
    return res.status(404).json({ error: "File not found or unauthorized" });
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
};
