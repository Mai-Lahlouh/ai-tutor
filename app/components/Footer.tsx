// components/Footer.tsx
"use client";

export default function Footer() {
  return (
    <footer className="bg-white shadow-inner py-4 mt-10">
      <div className="container text-sm mx-auto px-4 text-center text-gray-500">
        © {new Date().getFullYear()} Mai Lahlouh. All rights reserved.
      </div>
    </footer>
  );
}
