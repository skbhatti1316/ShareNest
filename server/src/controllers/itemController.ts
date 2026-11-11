import { Request, Response, NextFunction } from "express";
import { Item } from "../models/Item.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export async function getItems(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search, category, community, available, sort, owner } = req.query;

    const filter: Record<string, any> = {};

    if (category && category !== "All") {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    if (community && community !== "All") {
      filter.community = new RegExp(`^${community}$`, "i");
    }

    if (available === "true") {
      filter.available = true;
    }

    if (owner) {
      filter.owner = owner;
    }

    if (search && typeof search === "string" && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { name: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { category: { $regex: term, $options: "i" } },
        { location: { $regex: term, $options: "i" } },
        { ownerName: { $regex: term, $options: "i" } },
      ];
    }

    let query = Item.find(filter);

    if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    } else if (sort === "reviews") {
      query = query.sort({ reviewsCount: -1 });
    } else {
      // Default to highest rating
      query = query.sort({ rating: -1, createdAt: -1 });
    }

    const items = await query.exec();

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
}

export async function getItemById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await Item.findById(req.params.id).populate("owner", "name email community avatar phone bio");

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function createItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const {
      name,
      category,
      icon,
      imageUrl,
      location,
      description,
      condition,
      deposit,
      community,
    } = req.body;

    if (!name || !category || !description) {
      res.status(400).json({
        success: false,
        message: "Please provide item name, category, and description.",
      });
      return;
    }

    const item = await Item.create({
      name: name.trim(),
      category: category.trim(),
      icon: icon || "📦",
      imageUrl: imageUrl || "",
      owner: req.user._id,
      ownerName: req.user.name,
      ownerEmail: req.user.email,
      location: (location || req.user.community).trim(),
      community: (community || req.user.community).trim(),
      description: description.trim(),
      condition: condition || "Like New",
      deposit: deposit || "Free sharing",
      available: true,
      rating: 5.0,
      reviewsCount: 0,
      bg: "bg-emerald-50 text-emerald-600",
    });

    res.status(201).json({
      success: true,
      message: "Item listed successfully!",
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: "Item not found." });
      return;
    }

    // Check ownership or admin
    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "You are not authorized to update this item.",
      });
      return;
    }

    const allowedUpdates = [
      "name",
      "category",
      "icon",
      "imageUrl",
      "location",
      "description",
      "condition",
      "deposit",
      "available",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        (item as any)[field] = req.body[field];
      }
    });

    await item.save();

    res.status(200).json({
      success: true,
      message: "Item updated successfully.",
      item,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: "Item not found." });
      return;
    }

    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "You are not authorized to remove this item.",
      });
      return;
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item removed successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleItemAvailability(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: "Item not found." });
      return;
    }

    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "You are not authorized to change this item's availability.",
      });
      return;
    }

    item.available = req.body.available !== undefined ? req.body.available : !item.available;
    await item.save();

    res.status(200).json({
      success: true,
      available: item.available,
      message: item.available ? "Item is now marked as available" : "Item marked as unavailable",
    });
  } catch (error) {
    next(error);
  }
}
