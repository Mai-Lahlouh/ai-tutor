import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password } = await req.json();

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  return new Response(JSON.stringify({ message: "User created successfully" }));
}
