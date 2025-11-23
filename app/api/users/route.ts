import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return Response.json(users);
  } catch (err) {
    console.error("MongoDB Error:", err);
    return new Response(JSON.stringify({ error: "Database Error" }), { status: 500 });
  }
}
