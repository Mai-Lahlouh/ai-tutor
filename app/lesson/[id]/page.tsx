// app/lesson/[id]/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function LessonPage() {
  const router = useRouter();

  const params = useParams();
  const { id } = params as { id: string };

  // TODO: Fetch lesson content and quizzes from API using `id`
  const lesson = {
    title: `Lesson ${id}`,
    content: "Lesson content goes here...",
  };
  const quizzes = [
    { id: 1, question: "What is AI?", type: "mcq" },
    { id: 2, question: "Explain machine learning.", type: "short-answer" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">
          {lesson.title}
        </h1>
        <div className="mb-8 text-gray-700">{lesson.content}</div>

        <h2 className="text-gray-700 text-2xl font-semibold mb-4">Quizzes</h2>
        <div className="space-y-4">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <p className="text-gray-700">{q.question}</p>
              <button
                onClick={() => router.push(`/quiz/${q.id}`)} // navigate to Quiz page
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                Take Quiz
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
