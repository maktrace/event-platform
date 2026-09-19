import { Routes, Route } from "react-router";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import EventDetailsPage from "../pages/EventDetailsPage";
import CreateEventPage from "../pages/CreateEventPage";
import MyRegistrationsPage from "../pages/MyRegistrationsPage";
import EditEventPage from "../pages/EditEventPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/events/:id" element={<EventDetailsPage />} />
      <Route path="/create-event" element={<CreateEventPage />} />
      <Route path="/events/:id/edit" element={<EditEventPage />} />
      <Route
  path="/my-registrations"
  element={<MyRegistrationsPage />}
/>
    </Routes>
  );
};

export default AppRoutes;