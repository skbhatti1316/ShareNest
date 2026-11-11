import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  description: string;
  location: string;
  memberCount: number;
  banner?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: [true, "Community name is required"],
      unique: true,
      trim: true,
      maxlength: [120, "Community name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "A welcoming local sharing community for neighbors.",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    memberCount: {
      type: Number,
      default: 1,
    },
    banner: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Community: Model<ICommunity> =
  mongoose.models.Community || mongoose.model<ICommunity>("Community", CommunitySchema);
