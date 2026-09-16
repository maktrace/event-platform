import { Router } from "express";
import { getMyRegistrations } from "../controllers/registration.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/me",
  authenticate,
  getMyRegistrations
);

export default router;