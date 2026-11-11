import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { Notification } from "../models/Notification.js";

export async function getNotifications(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name email avatar")
      .populate("itemId", "name icon imageUrl")
      .populate("requestId", "status startDate endDate")
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: "Notification not found." });
      return;
    }

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      notification,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      unreadCount: 0,
    });
  } catch (error) {
    next(error);
  }
}
