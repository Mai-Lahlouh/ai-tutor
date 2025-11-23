"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterForm, ApiResponse } from "@/app/types/auth.types";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: ApiResponse = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded shadow w-96 space-y-4"
        >
          <h2 className="text-2xl font-semibold text-red-950">Register</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded text-gray-800"
          />
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
            className="w-full bg-red-950 text-white p-2 rounded"
          >
            Create Account
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-800 p-4">
        &copy; 2025 Mai Lahlouh. All rights reserved.
      </footer>
    </div>
  );
}
