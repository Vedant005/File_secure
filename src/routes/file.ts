import { Router } from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth";
import { getFileStatus, uploadFile } from "../controller/files";

const router = Router();

const upload = multer({
  dest: "./src/uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/upload", authenticateToken, upload.single("file"), uploadFile);
router.get("/files/:id", authenticateToken, getFileStatus);

export default router;
