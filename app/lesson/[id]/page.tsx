// app/lesson/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Lesson, Quiz } from "../../types/index.types";

export default function LessonPage() {
  const router = useRouter();

  const params = useParams();
  const { id } = params as { id: string };
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/lessons/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load lesson");
          return;
        }

        setLesson(data.lesson);
        setQuizzes(data.quizzes);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading lesson...</h2>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold text-red-600">{error}</h2>
      </div>
    );

  if (!lesson)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold text-red-600">Lesson not found</h2>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">
          {lesson.title}
        </h1>

        <h2 className="text-gray-700 text-2xl font-semibold mb-4">Quizzes</h2>
        <div className="space-y-4">
          {quizzes.map((q) => (
            <div
              key={q._id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <p className="text-gray-700">{q.question}</p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => router.push(`/quiz/${id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                >
                  Take Quiz
                </button>
              </div>

              {/* Show last attempts */}
              {q.attempts && q.attempts.length > 0 && (
                <div className="mt-3 text-gray-600 text-sm">
                  <h3 className="font-semibold mb-1">Last Attempts:</h3>
                  <ul className="space-y-1">
                    {q.attempts.map((a) => (
                      <li
                        key={a._id}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {new Date(a.createdAt).toLocaleString()} | Score:{" "}
                          {a.score} / {q.questions?.length}
                        </span>
                        {/* <button
                          onClick={() =>
                            router.push(`/quiz/${id}?attempt=${a._id}`)
                          }
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button> */}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
