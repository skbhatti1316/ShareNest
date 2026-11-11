import { Request, Response, NextFunction } from "express";
import { Community } from "../models/Community.js";
import { User } from "../models/User.js";
import { Item } from "../models/Item.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export async function getCommunities(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const communities = await Community.find().sort({ memberCount: -1 });

    // Also get item count per community
    const communitiesWithCounts = await Promise.all(
      communities.map(async (comm) => {
        const itemsCount = await Item.countDocuments({ community: comm.name, available: true });
        const membersCount = await User.countDocuments({ community: comm.name });
        return {
          ...comm.toObject(),
          itemsCount,
          membersCount: Math.max(membersCount, comm.memberCount || 1),
        };
      })
    );

    res.status(200).json({
      success: true,
      communities: communitiesWithCounts,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCommunity(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, description, location } = req.body;

    if (!name || !location) {
      res.status(400).json({
        success: false,
        message: "Community name and location are required.",
      });
      return;
    }

    const existing = await Community.findOne({ name: name.trim() });
    if (existing) {
      res.status(400).json({
        success: false,
        message: "A community with this name already exists.",
      });
      return;
    }

    const community = await Community.create({
      name: name.trim(),
      description: description || "A friendly neighborhood sharing community.",
      location: location.trim(),
      memberCount: 1,
    });

    // If user is authenticated, update their community
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { community: community.name });
    }

    res.status(201).json({
      success: true,
      message: "Community created successfully!",
      community,
    });
  } catch (error) {
    next(error);
  }
}

export async function joinCommunity(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const { communityName } = req.body;
    if (!communityName || !communityName.trim()) {
      res.status(400).json({ success: false, message: "Please specify a community name." });
      return;
    }

    const trimmed = communityName.trim();
    let comm = await Community.findOne({ name: trimmed });
    if (!comm) {
      comm = await Community.create({
        name: trimmed,
        location: trimmed,
        memberCount: 1,
      });
    }

    const oldCommunity = req.user.community;
    if (oldCommunity !== trimmed) {
      await Community.findOneAndUpdate({ name: oldCommunity }, { $inc: { memberCount: -1 } });
      await Community.findOneAndUpdate({ name: trimmed }, { $inc: { memberCount: 1 } });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { community: trimmed },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: `You have successfully joined ${trimmed}!`,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}
