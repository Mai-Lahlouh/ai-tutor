"use client";

import React, { useEffect, useState } from "react";

export default function Stats() {
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalQuizzes: 0,
    questionsAnsweredToday: 0,
    streak: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.error) setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mt-8">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 text-center">
        <p className="text-gray-600 text-lg mb-2">Lessons Created</p>
        <p className="text-red-900 text-3xl md:text-4xl font-bold">
          {stats.totalLessons}
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 text-center">
        <p className="text-gray-600 text-lg mb-2">Quizzes Attempted</p>
        <p className="text-red-900 text-3xl md:text-4xl font-bold">
          {stats.totalQuizzes}
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 text-center">
        <p className="text-gray-600 text-lg mb-2">Questions Answered Today</p>
        <p className="text-red-900 text-3xl md:text-4xl font-bold">
          {stats.questionsAnsweredToday}
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 text-center">
        <p className="text-gray-600 text-lg mb-2">Study Streak</p>
        <p className="text-red-900 text-3xl md:text-4xl font-bold">
          {stats.streak} days
        </p>
      </div>
    </div>
  );
}
