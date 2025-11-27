import mongoose, { Schema, Document, model } from "mongoose";

export interface ILesson extends Document {
  title: string;
  content?: string; 
  pdfUrl?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    content: { type: String },
    pdfUrl: { type: String },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
  },
  { timestamps: true }
);

const Lesson = mongoose.models.Lesson || model<ILesson>("Lesson", LessonSchema);
export default Lesson;
