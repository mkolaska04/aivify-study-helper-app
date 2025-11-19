'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  sourceType: string;
  sourceData: string;
  createdAt: string;
  questions: Question[];
}

interface Answer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export default function QuizPage() {
  const params = useParams();
  const id = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study/quizzes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setQuiz(data);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const handleOptionSelect = (option: string) => {
    if (!showResult) {
      setSelectedOption(option);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || !quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    // Normalize both strings for comparison (trim whitespace and normalize case)
    const normalizedSelected = selectedOption.trim();
    const normalizedCorrect = currentQuestion.correctAnswer.trim();
    const isCorrect = normalizedSelected === normalizedCorrect;

    // Debug log to help troubleshoot
    console.log('Selected:', normalizedSelected);
    console.log('Correct:', normalizedCorrect);
    console.log('Is Correct:', isCorrect);

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      isCorrect,
    };

    setAnswers([...answers, newAnswer]);
    setShowResult(true);
  };

  const handleDelete = async (quizId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study/quizzes/${quizId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.href = '/quizzes';
      } else {
        console.error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleNextQuestion = () => {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedOption('');
    setShowResult(false);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Quiz not found.</p>
        <Link href="/quizzes" className="text-button hover:underline">
          Back to quizzes
        </Link>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  if (quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/quizzes" className="text-button hover:underline mb-4 inline-block">
            ← Back to all quizzes
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-primary">{quiz.title}</h1>

        </div>

        <div className="bg-surface border border-outline rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed! 🎉</h2>
          <div className="mb-6">
            <p className="text-6xl font-bold text-blue-600 mb-2">{score}%</p>
            <p className="text-xl text-gray-600">
              {correctAnswers} out of {totalQuestions} correct
            </p>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const answer = answers[index];
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 ${answer.isCorrect
                      ? ' border-green-300'
                      : ' border-red-300'
                    }`}
                >
                  <p className="font-semibold mb-2">
                    Question {index + 1}: {question.question}
                  </p>
                  <p className="text-sm">
                    Your answer: <span className="font-medium">{answer.selectedAnswer}</span>
                  </p>
                  {!answer.isCorrect && (
                    <p className="text-sm text-success">
                      Correct answer: <span className="font-medium">{question.correctAnswer}</span>
                    </p>
                  )}
                  <p className="text-sm text-muted mt-2">{question.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-x-4">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Restart Quiz
            </button>
            <Link
              href="/quizzes"
              className="inline-block px-6 py-3 bg-secondary text-white rounded-md hover:bg-secondary_muted"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/quizzes" className="text-button hover:underline mb-4 inline-block">
          ← Back to all quizzes
        </Link>
        <div className="flex gap-2 items-center">
          <h1 className="text-3xl text-primary font-bold mb-2">{quiz.title}</h1>
          <button onClick={() => handleDelete(quiz.id)} className="px-4 py-2 bg-error text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
        </div>
        <p className="text-secondary">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-button h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-surface border border-outline rounded-lg shadow p-8 mb-6">
        <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${showCorrect
                    ? 'border-success'
                    : showIncorrect
                      ? ' border-error'
                      : isSelected
                        ? ' border-button'
                        : 'bg-surface border-outline hover:border-button'
                  } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrect && <span className="text-success font-bold">✓</span>}
                  {showIncorrect && <span className="text-error font-bold">✗</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div className="mt-6 p-4 bg-surface border border-outline rounded-lg">
            <p className="font-semibold text-button mb-2">Explanation:</p>
            <p className="text-muted">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleSubmitAnswer}
          disabled={!selectedOption || showResult}
          className="px-6 py-3 bg-button text-white rounded-md hover:bg-button_hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>

        {showResult && (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 bg-success text-white rounded-md hover:bg-green-700"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
