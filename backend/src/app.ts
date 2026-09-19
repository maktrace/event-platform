import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import registrationRoutes from "./routes/registration.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Event Platform API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

app.use(errorHandler);

export default app;