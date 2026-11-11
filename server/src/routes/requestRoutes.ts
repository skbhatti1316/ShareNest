import { Router } from "express";
import {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  cancelRequest,
  markReadyForPickup,
  confirmHandover,
  requestReturn,
  confirmReturn,
  getRequestMessages,
  sendRequestMessage,
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// All borrow request routes require authentication
router.use(protect);

router.post("/", createRequest);
router.get("/sent", getSentRequests);
router.get("/received", getReceivedRequests);
router.get("/:id", getRequestById);

// Status transition actions
router.patch("/:id/approve", approveRequest);
router.patch("/:id/reject", rejectRequest);
router.patch("/:id/cancel", cancelRequest);
router.patch("/:id/ready-pickup", markReadyForPickup);
router.patch("/:id/handover", confirmHandover);
router.patch("/:id/return-request", requestReturn);
router.patch("/:id/confirm-return", confirmReturn);

// Internal request chat
router.get("/:id/messages", getRequestMessages);
router.post("/:id/messages", sendRequestMessage);

export default router;
