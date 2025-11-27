import { useRouter } from "next/navigation";

export default function RecentLessons() {
  const router = useRouter();

  const lessons = [
    { id: 1, title: "Lesson 1", date: "2025-11-27", score: 85 },
    { id: 2, title: "Lesson 2", date: "2025-11-25", score: 90 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <h4 className="text-gray-600 text-lg font-semibold mb-2">{lesson.title}</h4>
          <p className="text-gray-500 mb-2">Created on: {lesson.date}</p>
          <p className="text-gray-700 mb-4">Score: {lesson.score}%</p>

          <button
            onClick={() => router.push(`/lesson/${lesson.id}`)}
            className="bg-blue-950 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition mr-2"
          >
            Open Lesson
          </button>
          <button
            onClick={() => router.push(`/quiz/${lesson.id}`)}
            className="bg-green-800 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
          >
            Take Quiz
          </button>
        </div>
      ))}
    </div>
  );
}
