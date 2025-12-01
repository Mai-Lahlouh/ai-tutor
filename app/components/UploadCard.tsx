// components/UploadCard.tsx
"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

export default function UploadCard() {
  const router = useRouter();

  const [inputType, setInputType] = useState<"file" | "text">("file");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const handleGenerate = async () => {
    if (inputType === "file" && !file) {
      alert("Please upload a file");
      return;
    }

    if (inputType === "text" && text.trim() === "") {
      alert("Please enter text");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", title);
      formData.append("difficulty", difficulty);
      formData.append("numQuestions", numQuestions.toString());

      if (inputType === "text") formData.append("text", text);
      if (inputType === "file" && file) formData.append("file", file);

      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      // Redirect to quiz page
      router.push(`/quiz/${data.lesson._id}`);
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Generate Lesson & Quiz
      </h3>

      {/* Lesson Title */}
      <input
        type="text"
        placeholder="Lesson title"
        className="mb-4 w-full border border-gray-300 rounded-md p-2 text-gray-700"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Toggle between File and Text */}
      <div className="mb-4 flex bg-gray-200 rounded-full overflow-hidden w-max">
        <button
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            inputType === "file" ? "bg-blue-950 text-white" : "text-gray-700"
          }`}
          onClick={() => setInputType("file")}
        >
          Upload File
        </button>

        <button
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            inputType === "text" ? "bg-blue-950 text-white" : "text-gray-700"
          }`}
          onClick={() => setInputType("text")}
        >
          Add Text
        </button>
      </div>

      {/* File Upload */}
      {inputType === "file" && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-blue-900 hover:bg-gray-50 transition mb-4"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500 text-center">
            {file ? file.name : "Drag & drop or click to choose file"}
          </p>
        </div>
      )}

      {/* Text Input */}
      {inputType === "text" && (
        <textarea
          placeholder="Paste your text here..."
          className="text-gray-900 mb-4 w-full h-32 p-2 border border-gray-300 rounded-md resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      )}

      {/* Difficulty */}
      <select
        className="mb-4 w-full border border-gray-300 rounded-md p-2 text-gray-700"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Number of Questions */}
      <input
        type="number"
        min={1}
        placeholder="Number of questions"
        className="mb-4 w-full border border-gray-300 rounded-md p-2 text-gray-700"
        value={numQuestions}
        onChange={(e) => setNumQuestions(Number(e.target.value))}
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {loading && (
        <p className="text-center mt-3 text-blue-600 font-medium">
          Processing your lesson... please wait
        </p>
      )}
    </div>
  );
}
