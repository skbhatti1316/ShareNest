import http from "http";
import path from "path";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { initSocketIO } from "./socket/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.IO
initSocketIO(httpServer);

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

// Standard Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || origin === clientUrl || origin.startsWith("http://localhost:")) {
        callback(null, true);
      } else {
        callback(null, true); // Dev-friendly permissive origin
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Static files for uploaded images
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

// Health Check Endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    app: "ShareNest Full-Stack API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/reviews", reviewRoutes);

// 404 Route Handler for undefined API routes
app.use("/api/*", (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`[Server] ShareNest Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  console.log(`[Server] Health check available at http://localhost:${PORT}/api/health`);
});
