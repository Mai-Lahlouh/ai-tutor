// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white shadow-sm rounded py-4 mb-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-bold text-blue-900">
          AI Tutor
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2 lg:space-x-4 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-900 transition">
            Dashboard
          </Link>

          <Link href="/lessons" className="hover:text-blue-900 transition">
            My Lessons
          </Link>

          <Link href="/profile" className="hover:text-blue-900 transition">
            Profile
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
