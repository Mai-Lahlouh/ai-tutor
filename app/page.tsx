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

        {/* Stats Section */}
        <section>
          <Stats />
        </section>
      </main>
      <Footer />
    </div>
  );
}
