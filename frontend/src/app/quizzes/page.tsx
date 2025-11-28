'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
}

interface Quiz {
  id: string;
  title: string;
  sourceType: string;
  createdAt: string;
  questions: Question[];
}

export default function QuizzesPage() {
  const { data: session } = useSession();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/study/quizzes/user/${session.user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Quizzes</h1>
        <Link
          href="/add-new"
          className="px-6 py-3 bg-button font-semibold text-white rounded-md hover:bg-button_hover"
        >
          Create New
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven&apos;t created any quizzes yet.</p>
          <Link href="/add-new" className="text-primary hover:underline">
            Create your first quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quizzes/${quiz.id}`}
              className="block p-6 bg-surface border border-outline rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-secondary">{quiz.title}</h2>
              <div className="text-sm text-text space-y-1">
                <p>{quiz.questions.length} questions</p>
                <p className="text-muted">Source: {quiz.sourceType}</p>
                <p className="text-xs text-muted">
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
