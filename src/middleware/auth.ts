import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT Secret not configured" });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    (req as any).user = payload;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
