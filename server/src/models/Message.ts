import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  requestId: Types.ObjectId;
  sender: Types.ObjectId;
  senderName: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "BorrowRequest",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ requestId: 1, createdAt: 1 });

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
