import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sharenest";

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("[Database] MongoDB connection error:", error);
    process.exit(1);
  }
}
