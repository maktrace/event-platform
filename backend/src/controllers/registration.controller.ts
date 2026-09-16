import { Request, Response } from "express";
import {
  getEventParticipants,
  getUserRegistrations,
  registerForEvent,
} from "../services/registration.service";
import { Event } from "../models/Event";

const getParamId = (req: Request): string => {
  const id = req.params.id;

  return Array.isArray(id) ? id[0] : id;
};

export const registerToEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const registration = await registerForEvent(
      req.user.userId,
      getParamId(req)
    );

    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
};

export const getMyRegistrations = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const registrations = await getUserRegistrations(
    req.user.userId
  );

  res.json(registrations);
};

export const getParticipants = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const eventId = getParamId(req);

  const event = await Event.findOne({
    _id: eventId,
    organizerId: req.user.userId,
  });

  if (!event) {
    res.status(404).json({
      message: "Event not found or access denied",
    });
    return;
  }

  const participants = await getEventParticipants(eventId);

  res.json(participants);
};