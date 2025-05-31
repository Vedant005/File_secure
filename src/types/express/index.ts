import { Request } from "express";
import * as multer from "multer";
import { JwtPayload } from "jsonwebtoken";
type User = {
  id: number;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: number };
      file?: Express.Multer.File;
    }
  }
}
