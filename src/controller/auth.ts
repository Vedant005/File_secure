import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { generateToken } from "../utils/jwtToken";

// Register
/**
 * Register a new user
 * @param {Request} req - Express request object containing email and password in the body
 * @param {Response} res - Express response object used to send back status and user info
 */
export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  res.status(201).json({ id: user.id, email: user.email });
};

// Login
/**
 * Authenticate a user and return a JWT token
 * @param {Request} req - Express request object containing email and password in the body
 * @param {Response} res - Express response object used to return the token or error message
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  res.json({ token });
};
