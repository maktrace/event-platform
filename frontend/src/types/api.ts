export type UserRole = "user" | "organizer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface EventOrganizer {
  _id: string;
  name: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizerId: string | EventOrganizer;
  createdAt: string;
  updatedAt?: string;
}

export interface Registration {
  _id: string;
  userId: string | User;
  eventId: string | Event;
  registeredAt: string;
  status: "registered" | "cancelled";
}

export interface ReviewAuthor {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  userId: string | ReviewAuthor;
  eventId: string;
  rating: number;
  comment: string;
  createdAt: string;
}