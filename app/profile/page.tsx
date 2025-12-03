"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";

type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
};

type QuizActivity = {
  _id: string;
  quizId: string;
  score: number;
  answers: any[];
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalQuizzes: 0,
    totalQuestionsAnswered: 0,
  });
  const [recentActivity, setRecentActivity] = useState<QuizActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.error) {
          console.error(data.error);
          return;
        }

        setUser(data.user);
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">User not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 p-6">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 md:px-8 lg:px-16">
        <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-3xl space-y-10">
          <div className="flex flex-col items-center">
            <Image
              src={user.avatar || "/avatar.jpg"}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full mb-6 border-4 border-gray-200"
            />
            <h2 className="text-center text-4xl font-bold text-gray-900">
              {user.name}
            </h2>
            <p className="text-center text-gray-500">{user.email}</p>
            <p className="text-center text-gray-400 text-sm">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-col md:flex-row justify-between gap-6 mt-8">
            <div className="flex-1 flex items-center p-6 rounded-xl shadow-md">
              <div>
                <p className="text-gray-700 text-xl">Lessons Completed</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.totalLessons}
                </p>
              </div>
            </div>

            <div className="flex-1 flex items-center p-6 rounded-xl shadow-md">
              <div>
                <p className="text-gray-700 text-xl">Quizzes Attempted</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.totalQuizzes}
                </p>
              </div>
            </div>

            <div className="flex-1 flex items-center p-6 rounded-xl shadow-md">
              <div>
                <p className="text-gray-700 text-xl">Questions Answered</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.totalQuestionsAnswered}
                </p>
              </div>
            </div>
          </div>

          {/* Logout button full width */}
          <section className="w-full mt-6">
            <button
              className="w-full bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition font-semibold"
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
            >
              Logout
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
