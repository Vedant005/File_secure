import jwt from "jsonwebtoken";

// JWT token generation code

export function generateToken(userId: number) {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string);
}
