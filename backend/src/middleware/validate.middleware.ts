import { NextFunction, Request, Response } from "express";

export const requireOrganizer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "organizer") {
    res.status(403).json({
      message: "Organizer role required",
    });
    return;
  }

  next();
};