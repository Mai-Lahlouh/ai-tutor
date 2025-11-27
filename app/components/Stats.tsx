// components/Stats.tsx
"use client";

import React from "react";

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
        <p className="text-gray-600">Total Lessons</p>
        <p className="text-red-900 text-2xl font-bold">12</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
        <p className="text-gray-600">Average Score</p>
        <p className="text-red-900 text-2xl font-bold">88%</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
        <p className="text-gray-600">Study Streak</p>
        <p className="text-red-900 text-2xl font-bold">5 days</p>
      </div>
    </div>
  );
}
