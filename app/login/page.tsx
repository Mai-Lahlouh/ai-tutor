"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm, ApiResponse } from "@/app/types/auth.types";
import Footer from "../components/Footer";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, []);

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow w-96 space-y-4"
        >
          <h2 className="text-2xl font-semibold text-gray-950">Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-800"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-800"
          />
          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-950 text-white p-2 rounded"
          >
            Login
          </button>

          <div className="text-center text-gray-700 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-950 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
