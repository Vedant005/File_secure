import { User } from "@prisma/client";
import * as express from "express";

// types defined for user and file as Express Request object does not include the user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
      file?: Express.Multer.File;
    }
  }
}

export {};
