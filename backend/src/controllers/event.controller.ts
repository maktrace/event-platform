import { Request, Response } from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "../services/event.service";

export const getEvents = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const events = await getAllEvents();

  res.json(events);
};

export const getEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const eventId = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

const event = await getEventById(eventId);

  if (!event) {
    res.status(404).json({
      message: "Event not found",
    });
    return;
  }

  res.json(event);
};

export const createNewEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const {
    title,
    description,
    date,
    location,
  } = req.body;

  if (
    typeof title !== "string" ||
    title.trim().length < 3
  ) {
    res.status(400).json({
      message: "Title must contain at least 3 characters",
    });
    return;
  }

  if (
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    res.status(400).json({
      message:
        "Description must contain at least 10 characters",
    });
    return;
  }

  if (
    typeof location !== "string" ||
    !location.trim()
  ) {
    res.status(400).json({
      message: "Location is required",
    });
    return;
  }

  const eventDate = new Date(date);

  if (
    typeof date !== "string" ||
    Number.isNaN(eventDate.getTime())
  ) {
    res.status(400).json({
      message: "Valid event date is required",
    });
    return;
  }

  if (eventDate <= new Date()) {
    res.status(400).json({
      message: "Event date must be in the future",
    });
    return;
  }

  const event = await createEvent({
    title: title.trim(),
    description: description.trim(),
    date: eventDate,
    location: location.trim(),
    organizerId: req.user.userId,
  });

  res.status(201).json(event);
};

export const updateExistingEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const allowedFields = [
    "title",
    "description",
    "date",
    "location",
  ];

  const updateData: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  if (
    updateData.title !== undefined &&
    (typeof updateData.title !== "string" ||
      updateData.title.trim().length < 3)
  ) {
    res.status(400).json({
      message: "Title must contain at least 3 characters",
    });
    return;
  }

  if (
    updateData.description !== undefined &&
    (typeof updateData.description !== "string" ||
      updateData.description.trim().length < 10)
  ) {
    res.status(400).json({
      message:
        "Description must contain at least 10 characters",
    });
    return;
  }

  if (
    updateData.location !== undefined &&
    (typeof updateData.location !== "string" ||
      !updateData.location.trim())
  ) {
    res.status(400).json({
      message: "Location is required",
    });
    return;
  }

  if (updateData.date !== undefined) {
    const eventDate = new Date(
      updateData.date as string
    );

    if (Number.isNaN(eventDate.getTime())) {
      res.status(400).json({
        message: "Invalid event date",
      });
      return;
    }

    if (eventDate <= new Date()) {
      res.status(400).json({
        message: "Event date must be in the future",
      });
      return;
    }

    updateData.date = eventDate;
  }

  if (typeof updateData.title === "string") {
    updateData.title = updateData.title.trim();
  }

  if (typeof updateData.description === "string") {
    updateData.description =
      updateData.description.trim();
  }

  if (typeof updateData.location === "string") {
    updateData.location =
      updateData.location.trim();
  }

  const eventId = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

const event = await updateEvent(
  eventId,
  req.user.userId,
  updateData
);

  if (!event) {
    res.status(404).json({
      message: "Event not found or access denied",
    });
    return;
  }

  res.json(event);
};

export const deleteExistingEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const eventId = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

const event = await deleteEvent(
  eventId,
  req.user.userId
);

  if (!event) {
    res.status(404).json({
      message: "Event not found or access denied",
    });
    return;
  }

  res.json({
    message: "Event deleted successfully",
  });
};