import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { Community } from "./models/Community.js";
import { Item } from "./models/Item.js";
import { BorrowRequest } from "./models/BorrowRequest.js";
import { Notification } from "./models/Notification.js";
import { Review } from "./models/Review.js";
import { Message } from "./models/Message.js";

dotenv.config();

const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sharenest";

export async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(mongoURI);
    console.log("[Seed] Connected to MongoDB.");

    // Clear existing collections
    await User.deleteMany({});
    await Community.deleteMany({});
    await Item.deleteMany({});
    await BorrowRequest.deleteMany({});
    await Notification.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    console.log("[Seed] Cleaned existing collections.");

    // 1. Seed Communities
    const communities = await Community.create([
      {
        name: "Sunrise Heights",
        description: "A lively apartment society of 450 friendly families sharing tools, books, and gear.",
        location: "Sunrise Heights, Sector 14",
        memberCount: 3,
      },
      {
        name: "Green Valley Society",
        description: "Eco-friendly residential complex with active sports and hobby sharing groups.",
        location: "Green Valley Society, North Block",
        memberCount: 1,
      },
      {
        name: "Lakeview Residency",
        description: "Close-knit community overlooking the lake, famous for weekend movie screenings.",
        location: "Lakeview Residency, West Hill",
        memberCount: 1,
      },
    ]);
    console.log(`[Seed] Seeded ${communities.length} communities.`);

    // 2. Seed Users
    // User A: Alex Rivera (Item Owner)
    const alex = await User.create({
      name: "Alex Rivera",
      email: "alex@example.com",
      password: "Password123!",
      community: "Sunrise Heights",
      phone: "+1 555-0101",
      bio: "Avid tech enthusiast and DIY maker. Happy to lend my projector and power tools to neighbors!",
      role: "user",
    });

    // User B: Jordan Lee (Borrower)
    const jordan = await User.create({
      name: "Jordan Lee",
      email: "jordan@example.com",
      password: "Password123!",
      community: "Sunrise Heights",
      phone: "+1 555-0102",
      bio: "Film buff & college student who loves organizing community movie and game nights.",
      role: "user",
    });

    // User C: Siddharth Bhatti
    const siddharth = await User.create({
      name: "Siddharth Bhatti",
      email: "siddharth@example.com",
      password: "Password123!",
      community: "Sunrise Heights",
      phone: "+1 555-0103",
      bio: "Neighborhood coordinator. Let's make sharing second nature!",
      role: "admin",
    });

    // User D: Rahul Patel
    const rahul = await User.create({
      name: "Rahul Patel",
      email: "rahul@example.com",
      password: "Password123!",
      community: "Sunrise Heights",
      phone: "+1 555-0104",
      bio: "Woodworker and weekend gardener with high quality tools.",
      role: "user",
    });

    console.log("[Seed] Seeded verified users:");
    console.log("  - User A (Owner):    alex@example.com     / Password123!");
    console.log("  - User B (Borrower): jordan@example.com   / Password123!");
    console.log("  - Siddharth:         siddharth@example.com/ Password123!");
    console.log("  - Rahul:             rahul@example.com    / Password123!");

    // 3. Seed Items
    const items = await Item.create([
      {
        name: "Full HD 1080p Smart Projector",
        category: "Electronics",
        icon: "📽️",
        imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
        owner: alex._id,
        ownerName: alex.name,
        ownerEmail: alex.email,
        location: "Sunrise Heights, Tower B",
        community: "Sunrise Heights",
        rating: 4.9,
        reviewsCount: 14,
        available: true,
        description: "High brightness 4K supported projector with HDMI & screen cast. Perfect for movie nights, FIFA gaming sessions, and presentations.",
        condition: "Excellent",
        deposit: "Free sharing",
        bg: "bg-blue-50 text-blue-600",
      },
      {
        name: "DeWalt 20V Cordless Drill & Bit Kit",
        category: "Tools",
        icon: "🔧",
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
        owner: rahul._id,
        ownerName: rahul.name,
        ownerEmail: rahul.email,
        location: "Sunrise Heights, Tower A",
        community: "Sunrise Heights",
        rating: 5.0,
        reviewsCount: 19,
        available: true,
        description: "Powerful 20V cordless drill with 30-piece drill bits, 2 lithium batteries, and hard carrying case. Ideal for home repair & DIY projects.",
        condition: "Like New",
        deposit: "Free sharing",
        bg: "bg-emerald-50 text-emerald-600",
      },
      {
        name: "Yonex Pro Badminton Rackets & Portable Net",
        category: "Sports",
        icon: "🏸",
        imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
        owner: alex._id,
        ownerName: alex.name,
        ownerEmail: alex.email,
        location: "Sunrise Heights, Club House",
        community: "Sunrise Heights",
        rating: 4.8,
        reviewsCount: 9,
        available: true,
        description: "Includes 4 lightweight graphite badminton rackets, portable net stand, and 6 nylon shuttlecocks with carrying bag.",
        condition: "Like New",
        deposit: "Free sharing",
        bg: "bg-amber-50 text-amber-600",
      },
      {
        name: "The Psychology of Money (Hardcover)",
        category: "Books",
        icon: "📚",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        owner: jordan._id,
        ownerName: jordan.name,
        ownerEmail: jordan.email,
        location: "Sunrise Heights, Tower C",
        community: "Sunrise Heights",
        rating: 5.0,
        reviewsCount: 22,
        available: true,
        description: "Hardcover edition of Morgan Housel's bestselling book on money, greed, and happiness. Great read for financial wisdom.",
        condition: "Mint Condition",
        deposit: "Free sharing",
        bg: "bg-purple-50 text-purple-600",
      },
      {
        name: "JBL PartyBox Bluetooth Speaker 100W",
        category: "Electronics",
        icon: "🔊",
        imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
        owner: rahul._id,
        ownerName: rahul.name,
        ownerEmail: rahul.email,
        location: "Sunrise Heights, Tower A",
        community: "Sunrise Heights",
        rating: 4.7,
        reviewsCount: 15,
        available: true,
        description: "Deep bass 100W party speaker with RGB LED sync lights and 12-hour battery backup. Waterproof design for rooftop parties.",
        condition: "Excellent",
        deposit: "Free sharing",
        bg: "bg-pink-50 text-pink-600",
      },
      {
        name: "6ft Heavy-Duty Folding Event Table",
        category: "Party Supplies",
        icon: "🪑",
        imageUrl: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80",
        owner: alex._id,
        ownerName: alex.name,
        ownerEmail: alex.email,
        location: "Sunrise Heights, Tower B",
        community: "Sunrise Heights",
        rating: 4.8,
        reviewsCount: 8,
        available: true,
        description: "6ft heavy duty folding table with handle. Seats up to 8 people. Folds in half for easy car trunk transport.",
        condition: "Good",
        deposit: "Free sharing",
        bg: "bg-yellow-50 text-yellow-600",
      },
      {
        name: "Smart LiDAR Robot Vacuum & Mop",
        category: "Home",
        icon: "🧹",
        imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
        owner: siddharth._id,
        ownerName: siddharth.name,
        ownerEmail: siddharth.email,
        location: "Sunrise Heights, Tower D",
        community: "Sunrise Heights",
        rating: 4.9,
        reviewsCount: 12,
        available: true,
        description: "Smart LiDAR mapping robot vacuum with mop attachment. Excellent for deep carpet cleaning and tile sweeping.",
        condition: "Like New",
        deposit: "Free sharing",
        bg: "bg-cyan-50 text-cyan-600",
      },
    ]);
    console.log(`[Seed] Seeded ${items.length} community items.`);

    // 4. Seed Reviews for projector
    const projector = items[0];
    await Review.create([
      {
        item: projector._id,
        user: jordan._id,
        userName: jordan.name,
        rating: 5,
        comment: "Used it for IPL finals screening in our society garden. Incredible brightness and crystal clear audio!",
      },
      {
        item: projector._id,
        user: siddharth._id,
        userName: siddharth.name,
        rating: 5,
        comment: "Alex set up the cables for me before pickup. Super polite and seamless exchange.",
      },
    ]);

    // 5. Seed a Completed request & a Pending request
    const drill = items[1];
    const pastRequest = await BorrowRequest.create({
      item: drill._id,
      borrower: jordan._id,
      owner: rahul._id,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      note: "Needed to hang some framed photos in my apartment.",
      status: "Returned",
      approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      readyAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      handoverAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      returnedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    });

    // Initial notification for past request
    await Notification.create({
      recipient: jordan._id,
      sender: rahul._id,
      type: "item_returned",
      title: "Return Confirmed & Completed ✅",
      message: "Rahul Patel confirmed the return of DeWalt 20V Cordless Drill & Bit Kit. Thank you!",
      requestId: pastRequest._id,
      itemId: drill._id,
      read: true,
    });

    console.log("[Seed] Database seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("[Seed] Error during seeding:", err);
    process.exit(1);
  }
}

seedDatabase();
