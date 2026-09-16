import { Router } from "express";
import {
  createNewEvent,
  deleteExistingEvent,
  getEvent,
  getEvents,
  updateExistingEvent,
} from "../controllers/event.controller";
import {
  getParticipants,
  registerToEvent,
} from "../controllers/registration.controller";
import {
  addReview,
  getReviews,
} from "../controllers/review.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireOrganizer } from "../middleware/validate.middleware";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEvent);

router.post(
  "/",
  authenticate,
  requireOrganizer,
  createNewEvent
);

router.put(
  "/:id",
  authenticate,
  requireOrganizer,
  updateExistingEvent
);

router.delete(
  "/:id",
  authenticate,
  requireOrganizer,
  deleteExistingEvent
);

router.post(
  "/:id/register",
  authenticate,
  registerToEvent
);

router.get(
  "/:id/participants",
  authenticate,
  requireOrganizer,
  getParticipants
);

router.post(
  "/:id/reviews",
  authenticate,
  addReview
);

router.get(
  "/:id/reviews",
  getReviews
);

export default router;