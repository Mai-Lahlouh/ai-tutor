//app/api/quizzes/[id]/submit/route.ts

import { connectDB } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Quiz from "@/app/models/Quiz";
import QuizAttempt from "@/app/models/QuizAttempt";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  await connectDB();

  try {
    const params = await context.params;
    const quizId = params.quizId;
    console.log("QUIZ ID RECEIVED:", quizId);

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const { answers } = await req.json();

    const quiz = await Quiz.findById(quizId);
    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const results = quiz.questions.map((q, index) => {
      const userAnswer = answers[index]?.answer ?? "";

      let isCorrect = false;
      if (q.type === "mcq") {
        const letter = userAnswer.includes(")")
          ? userAnswer.split(")")[0].trim()
          : userAnswer.trim();
        isCorrect = letter.toLowerCase() === q.answer.trim().toLowerCase();
      } else {
        isCorrect =
          userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
      }

      return {
        question: q.question,
        answer: userAnswer,
        correctAnswer: q.answer,
        isCorrect,
      };
    });

    const score = results.filter((r) => r.isCorrect).length;

    const attempt = await QuizAttempt.create({
      quizId,
      userId,
      answers: results,
      score,
    });

    return NextResponse.json({ attempt });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
