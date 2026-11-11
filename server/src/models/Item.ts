import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IItem extends Document {
  name: string;
  category: string;
  icon: string;
  imageUrl?: string;
  owner: Types.ObjectId;
  ownerName: string;
  ownerEmail: string;
  location: string;
  community: string;
  rating: number;
  reviewsCount: number;
  available: boolean;
  description: string;
  condition: string;
  deposit: string;
  bg: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [150, "Item name cannot exceed 150 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "📦",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner reference is required"],
      index: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    community: {
      type: String,
      required: [true, "Community is required"],
      trim: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    condition: {
      type: String,
      default: "Like New",
    },
    deposit: {
      type: String,
      default: "Free sharing",
    },
    bg: {
      type: String,
      default: "bg-emerald-50 text-emerald-600",
    },
  },
  {
    timestamps: true,
  }
);

ItemSchema.index({ name: "text", description: "text" });
ItemSchema.index({ category: 1, available: 1 });

export const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);
