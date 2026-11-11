import { Router } from "express";
import { addReview, getItemReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/item/:itemId", getItemReviews);
router.post("/", protect, addReview);

export default router;
