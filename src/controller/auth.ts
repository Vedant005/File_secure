import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { generateToken } from "../utils/jwtToken";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  res.status(201).json({ id: user.id, email: user.email });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  res.json({ token });
};
