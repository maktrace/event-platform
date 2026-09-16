import { Request, Response } from "express";
import {
  createReview,
  getEventReviews,
} from "../services/review.service";

const getParamId = (req: Request): string => {
  const id = req.params.id;

  return Array.isArray(id) ? id[0] : id;
};

export const addReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const { rating, comment } = req.body;

    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      res.status(400).json({
        message: "Rating must be an integer from 1 to 5",
      });
      return;
    }

    if (
      typeof comment !== "string" ||
      comment.trim().length < 2
    ) {
      res.status(400).json({
        message: "Comment must contain at least 2 characters",
      });
      return;
    }

    if (comment.trim().length > 1000) {
      res.status(400).json({
        message: "Comment must not exceed 1000 characters",
      });
      return;
    }

    const review = await createReview(
      req.user.userId,
      getParamId(req),
      rating,
      comment.trim()
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Review creation failed",
    });
  }
};

export const getReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reviews = await getEventReviews(getParamId(req));

    res.json(reviews);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get reviews",
    });
  }
};