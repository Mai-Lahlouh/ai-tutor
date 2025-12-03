"use client";

import { useEffect } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RecentLessons from "./components/RecentLessons";
import Stats from "./components/Stats";
import UploadCard from "./components/UploadCard";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 p-6">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-8 flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-700">
            Welcome back 👋
          </h1>
          <p className="text-gray-600 mb-6">
            Continue your learning or upload new study material
          </p>
          <UploadCard />
        </section>

        {/* Recent Lessons */}
        <section className="mb-10">
          <h2 className="text-gray-700 text-2xl font-semibold mb-4">
            Recent Lessons
          </h2>
          <RecentLessons />
        </section>

        {/* Link to All Lessons */}
        <div className="mt-6 mb-10 flex justify-center">
          <button
            onClick={() => router.push("/lessons")}
            className="inline-flex items-center px-6 py-3 bg-red-800 hover:bg-red-950 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            View All Lessons
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>

        {/* Stats Section */}
        <section>
          <Stats />
        </section>
      </main>
      <Footer />
    </div>
  );
}
