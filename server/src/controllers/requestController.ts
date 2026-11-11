import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { BorrowRequest, RequestStatus } from "../models/BorrowRequest.js";
import { Item } from "../models/Item.js";
import { Notification } from "../models/Notification.js";
import { Message } from "../models/Message.js";
import { emitToUser, emitToRequest } from "../socket/index.js";

// Helper date formatter
function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function createRequest(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const { itemId, startDate, endDate, note } = req.body;

    if (!itemId || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: "Please specify item, start date, and return date.",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid date format provided.",
      });
      return;
    }

    if (end < start) {
      res.status(400).json({
        success: false,
        message: "Return date cannot be earlier than start date.",
      });
      return;
    }

    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({
        success: false,
        message: "The requested item does not exist or has been removed.",
      });
      return;
    }

    // Borrower cannot request their own item
    if (item.owner.toString() === req.user._id.toString()) {
      res.status(400).json({
        success: false,
        message: "You cannot borrow an item that you already own.",
      });
      return;
    }

    // Check for duplicate active request by same borrower
    const duplicate = await BorrowRequest.findOne({
      item: item._id,
      borrower: req.user._id,
      status: { $in: ["Pending", "Approved", "Ready for Pickup", "Borrowed"] },
    });

    if (duplicate) {
      res.status(400).json({
        success: false,
        message: `You already have an active request (${duplicate.status}) for this item.`,
      });
      return;
    }

    // Create the request
    const borrowRequest = await BorrowRequest.create({
      item: item._id,
      borrower: req.user._id,
      owner: item.owner,
      startDate: start,
      endDate: end,
      note: note || "",
      status: "Pending",
    });

    // Populate for response
    await borrowRequest.populate([
      { path: "item", select: "name category icon imageUrl location" },
      { path: "borrower", select: "name email avatar phone community" },
      { path: "owner", select: "name email avatar phone community" },
    ]);

    // Create persistent notification for owner
    const notifMessage = `${req.user.name} requested to borrow your ${item.name} from ${formatDate(
      start
    )} to ${formatDate(end)}.`;

    const notification = await Notification.create({
      recipient: item.owner,
      sender: req.user._id,
      type: "request_received",
      title: "New Borrow Request",
      message: notifMessage,
      requestId: borrowRequest._id,
      itemId: item._id,
    });

    // Real-time notification over Socket.IO to owner
    emitToUser(item.owner.toString(), "new_borrow_request", {
      request: borrowRequest,
      notification,
    });
    emitToUser(item.owner.toString(), "notification", notification);

    res.status(201).json({
      success: true,
      message: "Borrow request submitted successfully! The owner has been notified.",
      request: borrowRequest,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSentRequests(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const requests = await BorrowRequest.find({ borrower: req.user._id })
      .populate("item")
      .populate("owner", "name email phone avatar community")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReceivedRequests(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const requests = await BorrowRequest.find({ owner: req.user._id })
      .populate("item")
      .populate("borrower", "name email phone avatar community")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRequestById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const request = await BorrowRequest.findById(req.params.id)
      .populate("item")
      .populate("borrower", "name email phone avatar community")
      .populate("owner", "name email phone avatar community");

    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found." });
      return;
    }

    const isBorrower = request.borrower._id.toString() === req.user._id.toString();
    const isOwner = request.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isBorrower && !isOwner && !isAdmin) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to view this request.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    next(error);
  }
}

export async function approveRequest(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const request = await BorrowRequest.findById(req.params.id).populate("item");
    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found." });
      return;
    }

    if (request.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only the item owner can approve this request.",
      });
      return;
    }

    if (request.status !== "Pending") {
      res.status(400).json({
        success: false,
        message: `Request cannot be approved because current status is '${request.status}'.`,
      });
      return;
    }

    // Concurrency-safe check: check for overlapping approved/borrowed bookings for this item
    const overlapping = await BorrowRequest.findOne({
      _id: { $ne: request._id },
      item: request.item._id,
      status: { $in: ["Approved", "Ready for Pickup", "Borrowed"] },
      startDate: { $lte: request.endDate },
      endDate: { $gte: request.startDate },
    });

    if (overlapping) {
      res.status(400).json({
        success: false,
        message:
          "Cannot approve: another overlapping approved booking exists for this item in the requested timeframe.",
      });
      return;
    }

    request.status = "Approved";
    request.approvedAt = new Date();
    await request.save();

    await request.populate([
      { path: "item", select: "name category icon imageUrl location" },
      { path: "borrower", select: "name email avatar phone community" },
      { path: "owner", select: "name email avatar phone community" },
    ]);

    const itemDoc = request.item as any;

    // Create persistent notification for borrower
    const notif = await Notification.create({
      recipient: request.borrower._id,
      sender: req.user._id,
      type: "request_approved",
      title: "Borrow Request Approved! 🎉",
      message: `${req.user.name} approved your request for ${itemDoc.name} (${formatDate(
        request.startDate
      )} - ${formatDate(request.endDate)}). Get ready for pickup!`,
      requestId: request._id,
      itemId: itemDoc._id,
    });

    // Emit real-time events
    emitToUser(request.borrower._id.toString(), "request_status_changed", {
      requestId: request._id,
      status: "Approved",
      request,
    });
    emitToUser(request.borrower._id.toString(), "notification", notif);
    emitToRequest(request._id.toString(), "request_updated", request);

    res.status(200).json({
      success: true,
      message: "Borrow request approved successfully!",
      request,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectRequest(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const { reason } = req.body;
    const request = await BorrowRequest.findById(req.params.id).populate("item");
    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found." });
      return;
    }

    if (request.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only the item owner can reject this request.",
      });
      return;
    }

    if (request.status !== "Pending") {
      res.status(400).json({
        success: false,
        message: `Request cannot be rejected because current status is '${request.status}'.`,
      });
      return;
    }

    request.status = "Rejected";
    request.rejectedAt = new Date();
    if (reason) request.rejectionReason = reason.trim();
    await request.save();

    await request.populate([
      { path: "item", select: "name category icon imageUrl location" },
      { path: "borrower", select: "name email avatar phone community" },
      { path: "owner", select: "name email avatar phone community" },
    ]);

    const itemDoc = request.item as any;

    const notif = await Notification.create({
      recipient: request.borrower._id,
      sender: req.user._id,
      type: "request_rejected",
      title: "Borrow Request Declined",
      message: `${req.user.name} declined your request for ${itemDoc.name}.${
        reason ? ` Reason: ${reason}` : ""
      }`,
      requestId: request._id,
      itemId: itemDoc._id,
    });

    emitToUser(request.borrower._id.toString(), "request_status_changed", {
      requestId: request._id,
      status: "Rejected",
      request,
    });
    emitToUser(request.borrower._id.toString(), "notification", notif);
    emitToRequest(request._id.toString(), "request_updated", request);

    res.status(200).json({
      success: true,
      message: "Borrow request declined.",
      request,
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelRequest(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const request = await BorrowRequest.findById(req.params.id).populate("item");
    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found." });
      return;
    }

    if (request.borrower.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only the borrower can cancel their own request.",
      });
      return;
    }

    if (request.status !== "Pending" && request.status !== "Approved") {
      res.status(400).json({
        success: false,
        message: `Cannot cancel request with status '${request.status}'.`,
      });
      return;
    }

    request.status = "Cancelled";
    await request.save();

    await request.populate([
      { path: "item", select: "name category icon imageUrl location" },
      { path: "borrower", select: "name email avatar phone community" },
      { path: "owner", select: "name email avatar phone community" },
    ]);

    const itemDoc = request.item as any;

    const notif = await Notification.create({
      recipient: request.owner._id,
      sender: req.user._id,
      type: "request_cancelled",
      title: "Borrow Request Cancelled",
      message: `${req.user.name} cancelled their borrow request for ${itemDoc.name}.`,
      requestId: request._id,
      itemId: itemDoc._id,
    });

    emitToUser(request.owner._id.toString(), "request_status_changed", {
      requestId: request._id,
      status: "Cancelled",
      request,
    });
    emitToUser(request.owner._id.toString(), "notification", notif);
    emitToRequest(request._id.toString(), "request_updated", request);

    res.status(200).json({
      success: true,
      message: "Borrow request cancelled.",
      request,
    });
  } catch (error) {
    next(error);
  }
}

export async function markReadyForPickup(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const request = await BorrowRequest.findById(req.params.id).populate("item");
    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found." });
      return;
    }

    if (request.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only the item owner can mark ready for pickup.",
      });
      return;
    }

    if (request.status !== "Approved") {
      res.status(400).json({
        success: false,
        message: `Item can only be marked ready for pickup when approved. Current: '${request.status}'`,
      });
      return;
    }

    request.status = "Ready for Pickup";
    request.readyAt = new Date();
    await request.save();

    await request.populate([
      { path: "item", select: "name category icon imageUrl location" },
      { path: "borrower", select: "name email avatar phone community" },
      { path: "owner", select: "name email avatar phone community" },
    ]);

    const itemDoc = request.item as any;

    const notif = await Notification.create({
      recipient: request.borrower._id,
      sender: req.user._id,
      type: "ready_for_pickup",
      title: "Ready for Pickup! 📍",
      message: `${itemDoc.name} is ready for pickup at ${itemDoc.location}. Connect with ${req.user.name} for handover.`,
      requestId: request._id,
      itemId: itemDoc._id,
    });

    emitToUser(request.borrower._id.toString(), "request_status_changed", {
      requestId: request._id,
      status: "Ready for Pickup",
      request,
    });
    emitToUser(request.borrower._id.toString(), "notification", notif);
    emitToRequest(request._id.toString(), "request_updated", request);

    res.status(200).json({
      success: true,
      message: "Item marked ready for pickup!",
      request,
    });
  } catch (error) {
    next(error);
  }
}

export async function confirmHandover(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const request = await BorrowRequest.findById(req.params.id).populate("item");
    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found." });
      return;
    }

    const isOwner = request.owner.toString() === req.user._id.toString();
    const isBorrower = request.borrower.toString() === req.user._id.toString();

    if (!isOwner && !isBorrower && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only owner or borrower can confirm handover.",
      });
      return;
    }

    if (request.status !== "Approved" && request.status !== "Ready for Pickup") {
      res.status(400).json({
        success: false,
        message: `Handover can only be confirmed from Approved or Ready for Pickup status. Current: '${request.status}'`,
      });
      return;
    }

    request.status = "Borrowed";
    request.handoverAt = new Date();
    await request.save();

    // Mark item as currently unavailable
    await Item.findByIdAndUpdate(request.item._id, { available: false });

    await request.populate([
      { path: "item", select: "name category icon imageUrl location" },
      { path: "borrower", select: "name email avatar phone community" },
      { path: "owner", select: "name email avatar phone community" },
    ]);

    const itemDoc = request.item as any;
    const recipientId = isOwner ? request.borrower._id : request.owner._id;

    const notif = await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: "item_borrowed",
      title: "Handover Confirmed 🤝",
      message: `Handover confirmed for ${itemDoc.name}. Due for return on ${formatDate(
        request.endDate
      )}.`,
      requestId: request._id,
      itemId: itemDoc._id,
    });

    emitToUser(recipientId.toString(), "request_status_changed", {
      requestId: request._id,
      status: "Borrowed",
      request,
    });
    emitToUser(recipientId.toString(), "notification", notif);
    emitToRequest(request._id.toString(), "request_updated", request);

    res.status(200).json({
      success: true,
      message: "Handover confirmed! The item is now marked as active loan.",
      request,
    });
  } catch (error) {
    next(error);
  }
}

export async function requestReturn(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const request = await BorrowRequest.findById(req.params.id).populate("item");
    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found." });
      return;
    }

    if (request.borrower.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only the borrower can initiate return request.",
      });
      return;
    }

    if (request.status !== "Borrowed") {
      res.status(400).json({
        success: false,
        message: `Return can only be requested for borrowed items. Current: '${request.status}'`,
      });
      return;
    }

    request.status = "Return Requested";
    request.returnRequestedAt = new Date();
    await request.save();

    await request.populate([
      { path: "item", select: "name category icon imageUrl location" },
      { path: "borrower", select: "name email avatar phone community" },
      { path: "owner", select: "name email avatar phone community" },
    ]);

    const itemDoc = request.item as any;

    const notif = await Notification.create({
      recipient: request.owner._id,
      sender: req.user._id,
      type: "return_requested",
      title: "Return Requested 🔄",
      message: `${req.user.name} is ready to return ${itemDoc.name}. Please confirm once you receive it.`,
      requestId: request._id,
      itemId: itemDoc._id,
    });

    emitToUser(request.owner._id.toString(), "request_status_changed", {
      requestId: request._id,
      status: "Return Requested",
      request,
    });
    emitToUser(request.owner._id.toString(), "notification", notif);
    emitToRequest(request._id.toString(), "request_updated", request);

    res.status(200).json({
      success: true,
      message: "Return request sent! Waiting for owner's confirmation.",
      request,
    });
  } catch (error) {
    next(error);
  }
}

export async function confirmReturn(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const request = await BorrowRequest.findById(req.params.id).populate("item");
    if (!request) {
      res.status(404).json({ success: false, message: "Borrow request not found." });
      return;
    }

    if (request.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only the item owner can confirm the return of the item.",
      });
      return;
    }

    if (request.status !== "Borrowed" && request.status !== "Return Requested") {
      res.status(400).json({
        success: false,
        message: `Return can only be confirmed for borrowed or return-requested items. Current: '${request.status}'`,
      });
      return;
    }

    request.status = "Returned";
    request.returnedAt = new Date();
    await request.save();

    // Mark item available again!
    await Item.findByIdAndUpdate(request.item._id, { available: true });

    await request.populate([
      { path: "item", select: "name category icon imageUrl location" },
      { path: "borrower", select: "name email avatar phone community" },
      { path: "owner", select: "name email avatar phone community" },
    ]);

    const itemDoc = request.item as any;

    const notif = await Notification.create({
      recipient: request.borrower._id,
      sender: req.user._id,
      type: "item_returned",
      title: "Return Confirmed & Completed ✅",
      message: `${req.user.name} confirmed the return of ${itemDoc.name}. Thank you for sharing responsibly! Leave a review to help the community.`,
      requestId: request._id,
      itemId: itemDoc._id,
    });

    emitToUser(request.borrower._id.toString(), "request_status_changed", {
      requestId: request._id,
      status: "Returned",
      request,
    });
    emitToUser(request.borrower._id.toString(), "notification", notif);
    emitToRequest(request._id.toString(), "request_updated", request);

    res.status(200).json({
      success: true,
      message: "Return confirmed! The item is now back in circulation as available.",
      request,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRequestMessages(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const request = await BorrowRequest.findById(req.params.id);
    if (!request) {
      res.status(404).json({ success: false, message: "Request not found." });
      return;
    }

    const isBorrower = request.borrower.toString() === req.user._id.toString();
    const isOwner = request.owner.toString() === req.user._id.toString();
    if (!isBorrower && !isOwner && req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Not authorized." });
      return;
    }

    const messages = await Message.find({ requestId: request._id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendRequestMessage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: "Message text cannot be empty." });
      return;
    }

    const request = await BorrowRequest.findById(req.params.id);
    if (!request) {
      res.status(404).json({ success: false, message: "Request not found." });
      return;
    }

    const isBorrower = request.borrower.toString() === req.user._id.toString();
    const isOwner = request.owner.toString() === req.user._id.toString();
    if (!isBorrower && !isOwner && req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Not authorized." });
      return;
    }

    const message = await Message.create({
      requestId: request._id,
      sender: req.user._id,
      senderName: req.user.name,
      text: text.trim(),
    });

    emitToRequest(request._id.toString(), "chat_message", message);

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
}
