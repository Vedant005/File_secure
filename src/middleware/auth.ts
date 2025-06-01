import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

/**
 * Middleware to authenticate user using JWT token
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Callback to pass control to the next middleware
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ message: "JWT Secret not configured" });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    (req as any).user = payload;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
