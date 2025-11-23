"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <main className="flex-grow flex items-center justify-center text-red-950">
        Dashboard Page
      </main>
      {/* Footer */}
      <footer className="text-center text-sm text-gray-800 p-4">
        &copy; 2025 Mai Lahlouh. All rights reserved.
      </footer>
    </div>
  );
}
