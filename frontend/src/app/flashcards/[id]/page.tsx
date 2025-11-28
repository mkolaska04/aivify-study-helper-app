'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  order: number;
}

interface FlashcardSet {
  id: string;
  title: string;
  sourceType: string;
  sourceData: string;
  createdAt: string;
  flashcards: Flashcard[];
}

export default function FlashcardSetPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleDelete = async (setId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this flashcard set? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study/flashcards/${setId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.href = '/flashcards';
      } else {
        console.error('Failed to delete flashcard set');
      }
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
    }
  }

  useEffect(() => {
    const loadFlashcardSet = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study/flashcards/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFlashcardSet(data);
        }
      } catch (error) {
        console.error('Error fetching flashcard set:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadFlashcardSet();
    }
  }, [id]);

  const handleNext = () => {
    if (flashcardSet && currentIndex < flashcardSet.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <p>Loading flashcards...</p>
      </div>
    );
  }

  if (!flashcardSet) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <p>Flashcard set not found.</p>
        <Link href="/flashcards" className="text-primary hover:underline">
          Back to flashcards
        </Link>
      </div>
    );
  }

  const currentCard = flashcardSet.flashcards[currentIndex];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl lg:py-16">
      <div className="mb-6">
        <Link href="/flashcards" className="text-button hover:underline mb-4 inline-block">
          ← Back to all flashcards
        </Link>
        <div className="flex gap-2 items-center">
        <h1 className="text-3xl font-bold mb-2 text-primary">{flashcardSet.title}</h1>

          <button onClick={() => handleDelete(flashcardSet.id)} className="px-4 py-2 bg-error text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
        </div>
        <p className="text-secondary">
          Card {currentIndex + 1} of {flashcardSet.flashcards.length}
        </p>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div
          onClick={handleFlip}
          className="relative w-full h-96 cursor-pointer perspective"
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-surface border-2 border-outline rounded-lg shadow-lg flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-sm text-muted mb-4">Front</p>
                <p className="text-2xl font-medium">{currentCard.front}</p>
                <p className="text-sm text-primary_muted mt-8">Click to flip</p>
              </div>
            </div>
            
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden bg-primary border-2 border-outline rounded-lg shadow-lg flex items-center justify-center p-8 rotate-y-180">
              <div className="text-center">
                <p className="text-sm text-text mb-4">Back</p>
                <p className="text-2xl font-medium">{currentCard.back}</p>
                <p className="text-sm text-primary_muted mt-8">Click to flip</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-6 py-3 bg-secondary text-gray-900 rounded-md hover:bg-secondary_muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        <button
          onClick={handleFlip}
          className="px-6 py-3 bg-button text-white rounded-md hover:bg-button_hover"
        >
          {isFlipped ? 'Show Front' : 'Show Back'}
        </button>
        
        <button
          onClick={handleNext}
          disabled={currentIndex === flashcardSet.flashcards.length - 1}
          className="px-6 py-3 bg-primary text-gray-900 rounded-md hover:bg-primary_muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-button h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / flashcardSet.flashcards.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
