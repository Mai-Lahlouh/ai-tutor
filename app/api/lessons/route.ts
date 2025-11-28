// app/api/lessons/route.ts
import { connectDB } from "@/app/lib/mongodb";
import Lesson from "@/app/models/Lesson";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { writeFile, unlink } from "fs/promises";
import { execFile } from "child_process";
import path from "path";
import Groq from "groq-sdk";
import Quiz from "@/app/models/Quiz";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const difficulty = (formData.get("difficulty") as string) || "easy";
    const numQuestions = parseInt(formData.get("numQuestions") as string) || 5;
    const text = formData.get("text") as string | null;
    const file = formData.get("file") as File | null;

    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    let content = text || "";

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const tempFilePath = path.join(process.cwd(), `temp_${file.name}`);

      await writeFile(tempFilePath, buffer);

      // Run Python script
      content = await new Promise<string>((resolve, reject) => {
        execFile(
          "python",
          ["./app/scripts/convert_file.py", tempFilePath],
          (error, stdout, stderr) => {
            unlink(tempFilePath).catch(() => {});

            if (error) {
              console.error(stderr);
              return reject(new Error(stderr || "Python conversion failed"));
            }
            resolve(stdout);
          }
        );
      });
    }
    console.log("Content after conversion:", content);

    if (!content)
      return NextResponse.json({ error: "Content is empty" }, { status: 400 });

    // Save lesson
    const lesson = await Lesson.create({
      userId,
      title,
      content,
      pdfUrl: null,
      difficulty,
      numQuestions,
    });

    // =============== QUIZ GENERATION USING GROQ =====================
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const aiRes = await groq.chat.completions.create({
      model: "groq/compound-mini",
      messages: [
        {
          role: "system",
          content: "Generate quiz questions in JSON format only.",
        },
        {
          role: "user",
          content: `
            Generate ${numQuestions} ${difficulty}-level questions 
            based ONLY on this lesson content:

            ${content}

            The questions can be either "mcq" (multiple choice) or "short-answer". 
            For "mcq" questions, provide 4 options. 
            For "short-answer" questions, do not include options. 

            Return JSON exactly like this:
            {
              "questions": [
                {
                  "question": "string",
                  "type": "mcq",
                  "options": ["A","B","C","D"],
                  "answer": "A"
                }
              ]
            }
          `,
        },
      ],
    });
    const quizJson = JSON.parse(aiRes.choices[0].message.content ?? "{}");
    const questions = quizJson.questions;

    // Save Quiz
    const quiz = await Quiz.create({
      lessonId: lesson._id,
      userId,
      title: `${title} - Quiz`,
      questions,
    });
    return NextResponse.json({ lesson, quiz });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const lessons = await Lesson.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ lessons });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
