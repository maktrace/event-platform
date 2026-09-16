import { Registration } from "../models/Registration";
import { Event } from "../models/Event";

export const registerForEvent = async (
  userId: string,
  eventId: string
) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.date <= new Date()) {
    throw new Error("Registration for this event is closed");
  }

  const existingRegistration = await Registration.findOne({
    userId,
    eventId,
  });

  if (existingRegistration) {
    throw new Error(
      "You are already registered for this event"
    );
  }

  return Registration.create({
    userId,
    eventId,
    status: "registered",
  });
};

export const getUserRegistrations = async (
  userId: string
) => {
  return Registration.find({ userId })
    .populate("eventId")
    .sort({ registeredAt: -1 });
};

export const getEventParticipants = async (
  eventId: string
) => {
  return Registration.find({
    eventId,
    status: "registered",
  })
    .populate("userId", "name email")
    .sort({ registeredAt: 1 });
};