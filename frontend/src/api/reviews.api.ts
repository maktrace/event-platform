import { apiClient } from "./client";
import type { Review } from "../types/api";

export interface ReviewData {
  rating: number;
  comment: string;
}

export const createReview = async (
  eventId: string,
  data: ReviewData
): Promise<Review> => {
  const response = await apiClient.post<Review>(
    `/events/${eventId}/reviews`,
    data
  );

  return response.data;
};

export const getEventReviews = async (
  eventId: string
): Promise<Review[]> => {
  const response = await apiClient.get<Review[]>(
    `/events/${eventId}/reviews`
  );

  return response.data;
};