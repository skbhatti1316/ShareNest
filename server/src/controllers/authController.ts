import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Community } from "../models/Community.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

const JWT_EXPIRES_IN = "7d";

function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || "super_secret_sharenest_jwt_key_2026_dev";
  return jwt.sign({ id: userId }, secret, { expiresIn: JWT_EXPIRES_IN });
}

function sendTokenResponse(user: any, statusCode: number, res: Response): void {
  const token = generateToken(user._id.toString());

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      community: user.community,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      role: user.role,
    },
  });
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, community, phone, bio } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide full name, email address, and password.",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "An account with this email address already exists. Please log in.",
      });
      return;
    }

    const selectedCommunity = (community || "Sunrise Heights").trim();

    // Ensure community exists or create it
    let commDoc = await Community.findOne({ name: selectedCommunity });
    if (!commDoc) {
      commDoc = await Community.create({
        name: selectedCommunity,
        location: selectedCommunity,
        memberCount: 1,
      });
    } else {
      commDoc.memberCount += 1;
      await commDoc.save();
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      community: selectedCommunity,
      phone: phone || "",
      bio: bio || "Happy neighbor sharing items!",
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      community: req.user.community,
      avatar: req.user.avatar,
      phone: req.user.phone,
      bio: req.user.bio,
      role: req.user.role,
    },
  });
}

export async function updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }

    const { name, community, phone, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    if (community && community.trim() !== user.community) {
      const oldComm = user.community;
      const newComm = community.trim();
      user.community = newComm;

      // Update community member counts
      await Community.findOneAndUpdate({ name: oldComm }, { $inc: { memberCount: -1 } });
      await Community.findOneAndUpdate(
        { name: newComm },
        { $inc: { memberCount: 1 } },
        { upsert: true }
      );
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        community: user.community,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
