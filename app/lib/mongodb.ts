import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "ai-tutor-proj",
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}