import { Event } from "../models/Event";

interface EventData {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizerId: string;
}

export const getAllEvents = async () => {
  return Event.find()
    .populate("organizerId", "name email")
    .sort({ date: 1 });
};

export const getEventById = async (eventId: string) => {
  return Event.findById(eventId)
    .populate("organizerId", "name email");
};

export const createEvent = async (data: EventData) => {
  return Event.create(data);
};

export const updateEvent = async (
  eventId: string,
  organizerId: string,
  data: Partial<EventData>
) => {
  return Event.findOneAndUpdate(
    {
      _id: eventId,
      organizerId,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteEvent = async (
  eventId: string,
  organizerId: string
) => {
  return Event.findOneAndDelete({
    _id: eventId,
    organizerId,
  });
};