"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { QuizQuestion } from "@/app/types/index.types";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const questionsPerPage = 5;

  // ========== Fetch Quiz Data ==========
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setQuiz(data.quizzes?.[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading quiz...</h2>
      </div>
    );

  if (!quiz)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold text-red-600">
          No quiz found for this lesson.
        </h2>
      </div>
    );

  const questions = quiz.questions;

  const handleChange = (qid: number, value: string) => {
    if (!submitted) setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const answersArray = Object.entries(answers).map(([qid, ans]) => ({
      answer: ans,
    }));
    const savedPage = 1;

    try {
      const res = await fetch(`/api/quizzes/${quiz._id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        return;
      }

      console.log("Quiz saved:", data.attempt);

      setSubmitted(true);
      setCurrentPage(savedPage);
    } catch (err) {
      console.error(err);
    }
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
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-center text-3xl font-bold mb-4 text-gray-700">
            {quiz.title}
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mx-auto max-w-2xl bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {currentQuestions.map((q: QuizQuestion, index: number) => {
          const qid = startIndex + index + 1;

          const userAnswer = answers[qid] || "";

          const isCorrect =
            submitted &&
            (q.type === "mcq"
              ? userAnswer.split(")")[0].trim().toLowerCase() ===
                q.answer.trim().toLowerCase()
              : userAnswer.trim().toLowerCase() ===
                q.answer.trim().toLowerCase());

          return (
            <div
              key={qid}
              className={`bg-white p-4 rounded-lg shadow-md border mb-4 transition mx-auto max-w-2xl ${
                submitted
                  ? isCorrect
                    ? "border-green-600"
                    : "border-red-600"
                  : "border-gray-200"
              }`}
            >
              <p className="text-gray-700 mb-2">{q.question}</p>

              {/* MCQ */}
              {q.type === "mcq" ? (
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx); // A, B, C...
                    const labeledOption = `${letter}) ${opt}`;

                    const selected = answers[qid] === labeledOption;
                    const correct =
                      submitted &&
                      labeledOption.split(")")[0].trim().toLowerCase() ===
                        q.answer.trim().toLowerCase();

                    return (
                      <label
                        key={idx}
                        className={`p-3 border rounded-lg cursor-pointer transition
        ${
          selected
            ? "bg-blue-600 text-white border-blue-600"
            : "text-gray-700 border-gray-300"
        }
        ${
          submitted && correct ? "bg-green-600 text-white border-green-600" : ""
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
                          name={`q-${qid}`}
                          value={labeledOption}
                          className="hidden"
                          checked={selected}
                          onChange={() => handleChange(qid, labeledOption)}
                          disabled={submitted}
                        />

                        {labeledOption}
                      </label>
                    );
                  })}
                </div>
              ) : (
                // SHORT ANSWER
                <input
                  type="text"
                  className={`border rounded-md p-2 w-full text-gray-600 transition
                    ${
                      submitted &&
                      answers[qid]?.trim().toLowerCase() ===
                        q.answer.trim().toLowerCase()
                        ? "border-green-600 bg-green-100"
                        : ""
                    }
                    ${
                      submitted &&
                      answers[qid]?.trim().toLowerCase() !==
                        q.answer.trim().toLowerCase()
                        ? "border-red-600 bg-red-100"
                        : ""
                    }
                  `}
                  value={answers[qid] || ""}
                  onChange={(e) => handleChange(qid, e.target.value)}
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
            className="disable:bg-gray-300 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-900">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="disable:bg-gray-300 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {currentPage === totalPages && !submitted && (
          <div className="mt-6 text-center">
            <button
              onClick={handleSubmit}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Quiz
            </button>
          </div>
        )}

        {/* Back to Lesson Button */}
        {submitted && (
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push(`/lesson/${id}`)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Lesson
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
