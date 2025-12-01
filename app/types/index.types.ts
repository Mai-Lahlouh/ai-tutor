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