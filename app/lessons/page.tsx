"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


interface Lesson {
  _id: string;
  title: string;
  content?: string;
  createdAt: string;
}

export default function MyLessonsPage() {
  const router = useRouter();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const lessonsPerPage = 6;

  // Fetch Lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/lessons", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        setLessons(data.lessons);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading lessons...</h2>
      </div>
    );

  // Pagination
  const totalPages = Math.ceil(lessons.length / lessonsPerPage);
  const startIndex = (currentPage - 1) * lessonsPerPage;
  const currentLessons = lessons.slice(startIndex, startIndex + lessonsPerPage);

  const getFirstSentence = (text?: string) => {
    if (!text) return "";
    const match = text.match(/[^.!?]+[.!?]?/);
    return match ? match[0] + (text.length > match[0].length ? " ..." : "") : text;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-700 text-center">
          My Lessons
        </h1>

        {lessons.length === 0 ? (
          <p className="text-center text-gray-600">No lessons found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentLessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition"
                  onClick={() => router.push(`/lesson/${lesson._id}`)}
                >
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    {lesson.title}
                  </h2>
                  {lesson.content && (
                    <p className="text-gray-600 text-sm">
                      {getFirstSentence(lesson.content)}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">
                    Created at: {new Date(lesson.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-gray-900">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
