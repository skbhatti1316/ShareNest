import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  toggleItemAvailability,
} from "../controllers/itemController.js";
import { protect, AuthRequest } from "../middleware/authMiddleware.js";

const router = Router();

// Configure local uploads directory
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "item-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// Image upload endpoint
router.post(
  "/upload-image",
  protect,
  upload.single("image"),
  (req: AuthRequest, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ success: false, message: "Please select an image file to upload." });
      return;
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      imageUrl,
    });
  }
);

// Standard item CRUD routes
router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", protect, createItem);
router.patch("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);
router.patch("/:id/availability", protect, toggleItemAvailability);

export default router;
