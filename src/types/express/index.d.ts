import { Request } from "express";
import * as multer from "multer";
import { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";
// type User = {
//   id: number;
//   email: string;
//   password: string;
// };
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
      file?: Express.Multer.File;
    }
  }
}
