// app/api/lessons/route.ts
export const runtime = "nodejs";
import { connectDB } from "@/app/lib/mongodb";
import Lesson from "@/app/models/Lesson";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { writeFile, unlink } from "fs/promises";
import { execFile } from "child_process";
import path from "path";
import Groq from "groq-sdk";
import Quiz from "@/app/models/Quiz";
import os from "os";

export async function POST(req: NextRequest) {
  console.log("STEP 1: Handler started");

  await connectDB();
  console.log("STEP 2: DB connected");

  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const formData = await req.formData();
    console.log("STEP 5: formData parsed");

    const title = formData.get("title") as string;
    const difficulty = (formData.get("difficulty") as string) || "easy";
    const numQuestions = parseInt(formData.get("numQuestions") as string) || 5;
    const text = formData.get("text") as string | null;
    const file = formData.get("file") as File | null;

    console.log("STEP 6: Title:", title);
    console.log("STEP 7: Difficulty:", difficulty);
    console.log("STEP 8: NumQuestions:", numQuestions);
    console.log("STEP 9: File exists:", !!file);

    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    let content = text || "";
    console.log("STEP 10: Initial content length:", content?.length || 0);

    if (file) {
      console.log("STEP 11: Reading file arrayBuffer...");

      const arrayBuffer = await file.arrayBuffer();
      console.log("STEP 12: arrayBuffer size:", arrayBuffer.byteLength);

      const buffer = Buffer.from(arrayBuffer);
      console.log("STEP 13: Buffer size:", buffer.length);

      const tempDir = process.env.VERCEL === "1" ? "/tmp" : os.tmpdir();

      const tempFilePath = path.join(tempDir, file.name);

      console.log("STEP 14: Temp directory:", tempDir);
      console.log("STEP 15: Temp file path:", tempFilePath);

      console.log("STEP 16: Writing temp file...");

      await writeFile(tempFilePath, buffer);
      console.log("STEP 17: Temp file written successfully");
      console.log("STEP 18: Running Python script...");

      // Run Python script
      content = await new Promise<string>((resolve, reject) => {
        execFile(
          "python3",
          [
            path.join(process.cwd(), "app/scripts/convert_file.py"),
            tempFilePath,
          ],
          (error, stdout, stderr) => {
            console.log("=== PYTHON CALLED ===");
            console.log("PYTHON STDOUT:", stdout);
            console.log("PYTHON STDERR:", stderr);
            console.log("PYTHON ERROR:", error);
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
    console.log("STEP 22: Generating quiz with Groq...");

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
    console.log("STEP 23: Groq response received");

    const quizJson = JSON.parse(aiRes.choices[0].message.content ?? "{}");
    const questions = quizJson.questions;
    console.log("STEP 24: Saving quiz...");

    // Save Quiz
    const quiz = await Quiz.create({
      lessonId: lesson._id,
      userId,
      title: `${title} - Quiz`,
      questions,
    });
    console.log("STEP 25: Quiz saved");

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
