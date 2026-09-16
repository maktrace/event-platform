import { Registration } from "../models/Registration";
import { Review } from "../models/Review";
import { Event } from "../models/Event";

export const createReview = async (
  userId: string,
  eventId: string,
  rating: number,
  comment: string
) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.date > new Date()) {
    throw new Error(
      "You can review an event only after it has taken place"
    );
  }

  const registration = await Registration.findOne({
    userId,
    eventId,
    status: "registered",
  });

  if (!registration) {
    throw new Error(
      "Only registered participants can leave a review"
    );
  }

  const existingReview = await Review.findOne({
    userId,
    eventId,
  });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this event"
    );
  }

  return Review.create({
    userId,
    eventId,
    rating,
    comment,
  });
};

export const getEventReviews = async (
  eventId: string
) => {
  return Review.find({ eventId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });
};