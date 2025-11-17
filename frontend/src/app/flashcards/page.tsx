'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardSet {
  id: string;
  title: string;
  sourceType: string;
  createdAt: string;
  flashcards: Flashcard[];
}

export default function FlashcardsPage() {
  const { data: session } = useSession();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study/flashcards/user/${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setFlashcardSets(data);
        }
      } catch (error) {
        console.error('Error fetching flashcard sets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, [session?.user?.id]);

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please log in to view your flashcards.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading flashcards...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Flashcard Sets</h1>
        <Link
          href="/add-new"
          className="px-6 py-3 bg-button font-semibold text-white rounded-md hover:bg-button_hover"
        >
          Create New
        </Link>
      </div>

      {flashcardSets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven&apos;t created any flashcard sets yet.</p>
          <Link
            href="/add-new"
            className="text-primary hover:underline"
          >
            Create your first flashcard set
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcardSets.map((set) => (
            <Link
              key={set.id}
              href={`/flashcards/${set.id}`}
              className="block p-6 bg-surface border border-outline rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold  text-secondary mb-2">{set.title}</h2>
              <p className="text-text mb-2">
                {set.flashcards?.length || 0} cards
              </p>
              <p className="text-sm text-muted">
                Created: {new Date(set.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted">
                Source: {set.sourceType}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
