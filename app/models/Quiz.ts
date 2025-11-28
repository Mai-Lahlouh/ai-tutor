import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: { type: String, required: true },
      type: { type: String, enum: ["mcq", "short-answer"], required: true },
      options: [{ type: String }],
      answer: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
