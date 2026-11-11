import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type NotificationType =
  | "request_received"
  | "request_approved"
  | "request_rejected"
  | "request_cancelled"
  | "ready_for_pickup"
  | "item_borrowed"
  | "return_requested"
  | "item_returned"
  | "system";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  sender?: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  requestId?: Types.ObjectId;
  itemId?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "request_received",
        "request_approved",
        "request_rejected",
        "request_cancelled",
        "ready_for_pickup",
        "item_borrowed",
        "return_requested",
        "item_returned",
        "system",
      ],
      default: "system",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "BorrowRequest",
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
