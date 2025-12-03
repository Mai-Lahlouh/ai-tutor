import { connectDB } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/models/User";
import Lesson from "@/app/models/Lesson";
import QuizAttempt from "@/app/models/QuizAttempt";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const totalLessons = await Lesson.countDocuments({ userId });
    const quizAttempts = await QuizAttempt.find({ userId }).sort({ createdAt: -1 }).limit(5);

    const totalQuizzes = await QuizAttempt.countDocuments({ userId });
    const totalQuestionsAnswered = quizAttempts.reduce(
      (acc, attempt) => acc + attempt.answers.length,
      0
    );

    return NextResponse.json({
      user,
      stats: {
        totalLessons,
        totalQuizzes,
        totalQuestionsAnswered,
      },
      recentActivity: quizAttempts,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
