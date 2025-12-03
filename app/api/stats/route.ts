// app/api/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/mongodb";
import QuizAttempt from "@/app/models/QuizAttempt";
import Lesson from "@/app/models/Lesson";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    // Total lessons created by user
    const totalLessons = await Lesson.countDocuments({ userId });

    // Quiz attempts by user
    const attempts = await QuizAttempt.find({ userId });

    const totalQuizzes = attempts.length;

    // Questions answered today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todaysAttempts = await QuizAttempt.find({
      userId,
      createdAt: { $gte: startOfDay },
    });
    
    const questionsAnsweredToday = todaysAttempts.reduce(
      (sum, attempt) => sum + attempt.answers.length,
      0
    );

    // Study streak
    const lastAttempts = attempts
      .map((a) => a.createdAt)
      .sort((a, b) => b.getTime() - a.getTime());
    let streak = 0;
    if (lastAttempts.length) {
      const today = new Date();
      for (const d of lastAttempts) {
        if (d.toDateString() === today.toDateString()) {
          streak++;
          today.setDate(today.getDate() - 1);
        } else break;
      }
    }

    return NextResponse.json({
      totalLessons,
      totalQuizzes,
      questionsAnsweredToday,
      streak,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
