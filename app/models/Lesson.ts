import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    default: null,
  },
  pdfUrl: {
    type: String,
    default: null,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  numQuestions: { type: Number, default: 5 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
