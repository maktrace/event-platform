import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = verifyToken(token);

    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};