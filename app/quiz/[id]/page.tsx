"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function QuizPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const questions = [
    {
      id: 1,
      text: "What is AI?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      answer: "Option 1",
    },
    {
      id: 2,
      text: "Explain ML.",
      options: [],
      answer: "Machine Learning explanation",
    },
    {
      id: 3,
      text: "What is Deep Learning?",
      options: ["A1", "A2"],
      answer: "A1",
    },
    {
      id: 4,
      text: "Define Neural Networks",
      options: [],
      answer: "Neural Networks definition",
    },
    {
      id: 5,
      text: "What is supervised learning?",
      options: ["Yes", "No"],
      answer: "Yes",
    },
    {
      id: 6,
      text: "Difference between AI and ML?",
      options: [],
      answer: "AI is broader than ML",
    },
    {
      id: 7,
      text: "What is reinforcement learning?",
      options: ["Opt1", "Opt2"],
      answer: "Opt1",
    },
  ];

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const questionsPerPage = 5;

  const handleChange = (qid: number, value: string) => {
    if (!submitted) setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.min(
    (answeredCount / questions.length) * 100,
    100
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-center text-3xl font-bold mb-4 text-gray-700">Quiz {id}</h1>

        {/* Progress Bar */}
        <div className="mx-auto max-w-2xl bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {currentQuestions.map((q) => {
          const isCorrect =
            submitted &&
            (answers[q.id] || "").trim().toLowerCase() ===
              q.answer.trim().toLowerCase();
          return (
            <div
              key={q.id}
              className={`bg-white p-4 rounded-lg shadow-md border mb-4 transition mx-auto max-w-2xl ${
                submitted
                  ? isCorrect
                    ? "border-green-600"
                    : "border-red-600"
                  : "border-gray-200"
              }`}
            >
              <p className="text-gray-700 mb-2">{q.text}</p>

              {q.options.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, index) => {
                    const letter = String.fromCharCode(65 + index);
                    const selected = answers[q.id] === opt;
                    const correct = submitted && opt === q.answer;
                    return (
                      <label
                        key={index}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition
                          ${
                            selected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "text-gray-700 border-gray-300"
                          }
                          ${
                            submitted && correct
                              ? "bg-green-600 text-white border-green-600"
                              : ""
                          }
                          ${
                            submitted && selected && !correct
                              ? "bg-red-600 text-white border-red-600"
                              : ""
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={opt}
                          checked={selected}
                          onChange={() => handleChange(q.id, opt)}
                          className="hidden"
                          disabled={submitted}
                        />
                        <span className="font-semibold mr-2">{letter}.</span>
                        {opt}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <input
                  type="text"
                  className={`border rounded-md p-2 w-full text-gray-600 transition
                    ${
                      submitted && answers[q.id] === q.answer
                        ? "border-green-600 bg-green-100"
                        : ""
                    }
                    ${
                      submitted && answers[q.id] !== q.answer
                        ? "border-red-600 bg-red-100"
                        : ""
                    }
                  `}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  disabled={submitted}
                />
              )}

              {submitted && !isCorrect && (
                <p className="text-red-600 mt-1">Correct answer: {q.answer}</p>
              )}
              {submitted && isCorrect && (
                <p className="text-green-600 mt-1">Correct!</p>
              )}
            </div>
          );
        })}

        {/* Pagination */}
        <div className="mx-auto max-w-2xl flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-red-900 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-900">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-red-900 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {currentPage === totalPages && !submitted && (
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Quiz
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
}
