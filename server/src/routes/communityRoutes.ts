import { Router } from "express";
import {
  getCommunities,
  createCommunity,
  joinCommunity,
} from "../controllers/communityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getCommunities);
router.post("/", protect, createCommunity);
router.post("/join", protect, joinCommunity);

export default router;
