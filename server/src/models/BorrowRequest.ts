import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type RequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled"
  | "Ready for Pickup"
  | "Borrowed"
  | "Return Requested"
  | "Returned"
  | "Overdue";

export interface IBorrowRequest extends Document {
  item: Types.ObjectId;
  borrower: Types.ObjectId;
  owner: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  note?: string;
  status: RequestStatus;
  rejectionReason?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  readyAt?: Date;
  handoverAt?: Date;
  returnRequestedAt?: Date;
  returnedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowRequestSchema = new Schema<IBorrowRequest>(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item reference is required"],
      index: true,
    },
    borrower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Borrower reference is required"],
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner reference is required"],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Cancelled",
        "Ready for Pickup",
        "Borrowed",
        "Return Requested",
        "Returned",
        "Overdue",
      ],
      default: "Pending",
      index: true,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    readyAt: {
      type: Date,
    },
    handoverAt: {
      type: Date,
    },
    returnRequestedAt: {
      type: Date,
    },
    returnedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

BorrowRequestSchema.index({ item: 1, status: 1 });
BorrowRequestSchema.index({ borrower: 1, createdAt: -1 });
BorrowRequestSchema.index({ owner: 1, createdAt: -1 });

export const BorrowRequest: Model<IBorrowRequest> =
  mongoose.models.BorrowRequest || mongoose.model<IBorrowRequest>("BorrowRequest", BorrowRequestSchema);
