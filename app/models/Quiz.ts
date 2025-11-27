import mongoose, { Schema, Document, model } from "mongoose";

export interface IOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuiz extends Document {
  lesson: mongoose.Types.ObjectId;
  question: string;
  options: IOption[];
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const QuizSchema = new Schema<IQuiz>(
  {
    lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    question: { type: String, required: true },
    options: { type: [OptionSchema], required: true },
    explanation: { type: String, required: true },
  },
  { timestamps: true }
);

const Quiz = mongoose.models.Quiz || model<IQuiz>("Quiz", QuizSchema);
export default Quiz;
