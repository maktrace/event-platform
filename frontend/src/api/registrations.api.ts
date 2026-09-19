import { apiClient } from "./client";
import type { Registration } from "../types/api";

export const registerForEvent = async (
  eventId: string
): Promise<Registration> => {
  const response = await apiClient.post<Registration>(
    `/events/${eventId}/register`
  );

  return response.data;
};

export const getMyRegistrations = async (): Promise<Registration[]> => {
  const response = await apiClient.get<Registration[]>(
    "/registrations/me"
  );

  return response.data;
};

export const getEventParticipants = async (
  eventId: string
): Promise<Registration[]> => {
  const response = await apiClient.get<Registration[]>(
    `/events/${eventId}/participants`
  );

  return response.data;
};