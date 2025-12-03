export interface Quiz {
  _id: string;
  question: string;
  type: string;
  title?: string;
  questions?: any[];
  attempts?: Attempt[];
}

export interface Lesson {
  _id: string;
  title: string;
  content: string;
}
export interface Attempt {
  _id: string;
  score: number;
  createdAt: string;
}

export interface QuizQuestion {
  question: string;
  type: "mcq" | "short";
  options: string[];
  answer: string;
}

export interface QuizResult {
  question: string;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
};