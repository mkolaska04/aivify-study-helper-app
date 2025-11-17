'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Summary {
    id: string;
    title: string;
    content: string;
    sourceType: string;
    sourceData: string;
    createdAt: string;
}

export default function SummaryPage() {
    const params = useParams();
    const id = params.id as string;

    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study/summaries/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSummary(data);
                }
            } catch (error) {
                console.error('Error fetching summary:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSummary();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Loading summary...</p>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Summary not found.</p>
                <Link href="/summaries" className="text-secondary hover:underline">
                    Back to summaries
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Link href="/summaries" className="text-secondary hover:underline mb-4 inline-block">
                    ← Back to all summaries
                </Link>
                <h1 className="text-3xl font-bold mb-2">{summary.title}</h1>
                <div className="text-sm text-muted">
                    <p>Source: {summary.sourceType}</p>
                    <p>Created: {new Date(summary.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="bg-surface border border-outline rounded-lg shadow p-8">
                <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-text leading-relaxed">
                        {summary.content}
                    </div>
                </div>
            </div>

            {summary.sourceType === 'text' && summary.sourceData && (
                <div className="mt-8">
                    <details className="bg-surface border border-outline rounded-lg p-6">
                        <summary className="cursor-pointer font-semibold text-primary_muted hover:text-primary">
                            Show original text
                        </summary>
                        <div className="mt-4 text-sm text-muted whitespace-pre-wrap">
                            <div className="text-text">
                                {summary.sourceData}
                            </div>
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
}
