"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Lesson {
  _id: string;
  title: string;
  createdAt: string;
  score?: number;
  numQuestions?: number;
}

export default function RecentLessons() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/lessons", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setLessons(data.lessons || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading || lessons.length === 0) return null; // show nothing if no lessons

  // Show only lessons 2 to 4
  const displayedLessons = lessons.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {displayedLessons.map((lesson) => (
        <div
          key={lesson._id}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <h4 className="text-gray-600 text-lg font-semibold mb-2">{lesson.title}</h4>
          <p className="text-gray-500 mb-2">
            Created on: {new Date(lesson.createdAt).toLocaleDateString()}
          </p>
          {lesson.score !== undefined && (
            <p className="text-gray-700 mb-4">Score: {lesson.score} / {lesson.numQuestions}</p>
          )}

          <button
            onClick={() => router.push(`/lesson/${lesson._id}`)}
            className="bg-blue-950 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition mr-2"
          >
            Open Lesson
          </button>
          <button
            onClick={() => router.push(`/quiz/${lesson._id}`)}
            className="bg-green-800 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
          >
            Take Quiz
          </button>
        </div>
      ))}
    </div>
  );
}
