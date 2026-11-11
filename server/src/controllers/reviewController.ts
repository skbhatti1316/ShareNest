import { Request, Response, NextFunction } from "express";
import { Review } from "../models/Review.js";
import { Item } from "../models/Item.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export async function addReview(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const { itemId, rating, comment, requestId } = req.body;

    if (!itemId || !rating || !comment) {
      res.status(400).json({
        success: false,
        message: "Please provide item, rating (1-5), and a review comment.",
      });
      return;
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5.",
      });
      return;
    }

    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({ success: false, message: "Item not found." });
      return;
    }

    const review = await Review.create({
      item: item._id,
      user: req.user._id,
      userName: req.user.name,
      rating: numRating,
      comment: comment.trim(),
      requestId,
    });

    // Recalculate average rating & review count
    const allReviews = await Review.find({ item: item._id });
    const count = allReviews.length;
    const avg =
      count > 0
        ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
        : 5.0;

    item.reviewsCount = count;
    item.rating = avg;
    await item.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully! Thank you for your feedback.",
      review,
      itemRating: item.rating,
      itemReviewsCount: item.reviewsCount,
    });
  } catch (error) {
    next(error);
  }
}

export async function getItemReviews(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reviews = await Review.find({ item: req.params.itemId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
}
