'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Summary {
  id: string;
  title: string;
  sourceType: string;
  createdAt: string;
}

export default function SummariesPage() {
  const { data: session } = useSession();
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/study/summaries/user/${session.user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setSummaries(data);
        }
      } catch (error) {
        console.error('Error fetching summaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <p>Loading summaries...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Summaries</h1>
        <Link
          href="/add-new"
          className="px-6 py-3 bg-button font-semibold text-white rounded-md hover:bg-button_hover"
        >
          Create New
        </Link>
      </div>

      {summaries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text mb-4">You haven&apos;t created any summaries yet.</p>
          <Link href="/add-new" className="text-primary hover:underline">
            Create your first summary
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((summary) => (
            <Link
              key={summary.id}
              href={`/summaries/${summary.id}`}
              className="block p-6 bg-surface border border-outline rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-secondary">{summary.title}</h2>
              <div className="text-sm text-text space-y-1">
                <p>Source: {summary.sourceType}</p>
                <p className="text-xs text-muted">
                  {new Date(summary.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
