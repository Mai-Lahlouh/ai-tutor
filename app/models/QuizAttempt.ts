// models/QuizAttempt.ts
import mongoose from "mongoose";

const QuizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      question: String,
      answer: String,
      correctAnswer: String,
      isCorrect: Boolean,
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.QuizAttempt ||
  mongoose.model("QuizAttempt", QuizAttemptSchema);
