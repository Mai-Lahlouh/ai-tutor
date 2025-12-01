// app/api/lessons/[id]/route.ts
import { connectDB } from "@/app/lib/mongodb";
import Lesson from "@/app/models/Lesson";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Quiz from "@/app/models/Quiz";
import QuizAttempt from "@/app/models/QuizAttempt";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {
    const params = await context.params;
    const lessonId = params.id;

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const lesson = await Lesson.findOne({
      _id: new mongoose.Types.ObjectId(lessonId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!lesson)
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const quizzes = await Quiz.find({ lessonId }).lean();
    const quizzesWithAttempts = await Promise.all(
      quizzes.map(async (q) => {
        const attempts = await QuizAttempt.find({ quizId: q._id, userId })
          .sort({ submittedAt: -1 })
          .limit(8)
          .lean();

        return { ...q, attempts };
      })
    );

    return NextResponse.json({ lesson, quizzes: quizzesWithAttempts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
