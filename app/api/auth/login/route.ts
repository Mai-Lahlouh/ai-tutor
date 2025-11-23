import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });
  }

  // Create JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

  return new Response(JSON.stringify({ token }));
}
