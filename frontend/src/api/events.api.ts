import { apiClient } from "./client";
import type { Event } from "../types/api";

export interface EventData {
  title: string;
  description: string;
  date: string;
  location: string;
}

export const getEvents = async (): Promise<Event[]> => {
  const response = await apiClient.get<Event[]>("/events");

  return response.data;
};

export const getEvent = async (id: string): Promise<Event> => {
  const response = await apiClient.get<Event>(`/events/${id}`);

  return response.data;
};

export const createEvent = async (
  data: EventData
): Promise<Event> => {
  const response = await apiClient.post<Event>("/events", data);

  return response.data;
};

export const updateEvent = async (
  id: string,
  data: Partial<EventData>
): Promise<Event> => {
  const response = await apiClient.put<Event>(
    `/events/${id}`,
    data
  );

  return response.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await apiClient.delete(`/events/${id}`);
};