import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Lesson from "@/app/models/Lesson";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { title, content, pdfUrl, difficulty } = await req.json();
    const lesson = await Lesson.create({ title, content, pdfUrl, difficulty });
    return NextResponse.json(lesson, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}
