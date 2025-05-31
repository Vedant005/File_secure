import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return; // Add return to stop execution
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ message: "JWT Secret not configured" });
    return; // Add return to stop execution
  }

  try {
    const payload = jwt.verify(token, jwtSecret); // jwtSecret is now ensured to be string
    (req as any).user = payload;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
