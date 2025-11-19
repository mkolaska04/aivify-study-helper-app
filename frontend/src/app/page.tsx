'use client';

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  return (
    <div >
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
          </div>
          <h1 className="text-5xl font-bold text-text mb-4">
            Welcome to Aivify
          </h1>
          <p className="text-xl text-muted mb-8">
            Your AI-powered study helper
          </p>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-lg text-text">
                Hello, <span className="font-semibold text-primary">{user.name || user.email}</span>!
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => router.push("/add-new")}
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary_muted transition-colors"
                >
                  Create New Study Material
                </button>
                <button
                  onClick={() => router.push("/summaries")}
                  className="bg-secondary text-white px-6 py-3 rounded-md hover:bg-secondary_muted transition-colors"
                >
                  View Summaries
                </button>
                <button
                  onClick={() => router.push("/quizzes")}
                  className="bg-secondary text-white px-6 py-3 rounded-md hover:bg-secondary_muted transition-colors"
                >
                  Take a Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-muted">
                Sign up or log in to start creating study materials
              </p>
              <button
                onClick={() => signIn('google')}
                className="bg-white text-gray-800 border border-gray-300 px-8 py-4 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center gap-3 font-medium text-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-surface p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-text mb-2">📝 Summaries</h3>
            <p className="text-muted">Generate AI-powered summaries from your study materials</p>
          </div>
          <div className="bg-surface p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-text mb-2">🎯 Quizzes</h3>
            <p className="text-muted">Create interactive quizzes to test your knowledge</p>
          </div>
          <div className="bg-surface p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-text mb-2">🃏 Flashcards</h3>
            <p className="text-muted">Build flashcard decks for efficient studying</p>
          </div>
        </div>
      </main>
    </div>
  );
}
