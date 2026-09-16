import jwt from "jsonwebtoken";
import { UserRole } from "../models/User";

interface JwtPayload {
  userId: string;
  role: UserRole;
}

export const generateToken = (
  userId: string,
  role: UserRole
): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    { userId, role },
    secret,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, secret) as JwtPayload;
};