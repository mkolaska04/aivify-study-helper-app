'use client';
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddNew() {
    const { data: session } = useSession();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [resType, setResType] = useState<'summary' | 'quiz' | 'flashcards'>('summary');
    const [contentType, setContentType] = useState<'file' | 'text'>('text');
    const [title, setTitle] = useState('');
    const [textContent, setTextContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!session?.user?.id) {
            setError('You must be logged in to create study materials');
            return;
        }

        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }

        if (contentType === 'text' && !textContent.trim()) {
            setError('Please enter some text content');
            return;
        }

        if (contentType === 'file' && !file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('userId', session.user.id);
            formData.append('title', title);
            formData.append('sourceType', contentType);

            if (contentType === 'file' && file) {
                formData.append('file', file);
            } else {
                formData.append('text', textContent);
            }

            const endpoint = resType === 'summary' 
                ? '/api/study/summaries' 
                : resType === 'quiz' 
                ? '/api/study/quizzes' 
                : '/api/study/flashcards';

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || 'Failed to create study material';
                const errorDetails = errorData.details;
                
                throw new Error(errorDetails ? `${errorMessage}\n${errorDetails}` : errorMessage);
            }

            const data = await response.json();
            
            // Redirect to the created item
            if (resType === 'summary') {
                router.push(`/summaries/${data.id}`);
            } else if (resType === 'quiz') {
                router.push(`/quizzes/${data.id}`);
            } else {
                router.push(`/flashcards/${data.id}`);
            }
        } catch (err) {
            console.error('Error creating study material:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to create study material. Please try again.';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 lg:py-16">
            <h1 className="text-3xl font-bold mb-6">Create New Study Material</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a title for your study material"
                        required
                    />
                </div>

                {/* Result Type Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">Result Type</label>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="resType"
                                value="summary"
                                checked={resType === "summary"}
                                onChange={(e) => setResType(e.target.value as 'summary')}
                                className="mr-2"
                            />
                            Summary
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="resType"
                                value="quiz"
                                checked={resType === "quiz"}
                                onChange={(e) => setResType(e.target.value as 'quiz')}
                                className="mr-2"
                            />
                            Quiz
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="resType"
                                value="flashcards"
                                checked={resType === "flashcards"}
                                onChange={(e) => setResType(e.target.value as 'flashcards')}
                                className="mr-2"
                            />
                            Flashcards
                        </label>
                    </div>
                </div>

                {/* Content Type Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">Content Type</label>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="contentType"
                                value="text"
                                checked={contentType === "text"}
                                onChange={(e) => setContentType(e.target.value as 'text')}
                                className="mr-2"
                            />
                            Text
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="contentType"
                                value="file"
                                checked={contentType === "file"}
                                onChange={(e) => setContentType(e.target.value as 'file')}
                                className="mr-2"
                            />
                            File
                        </label>
                    </div>
                </div>

                {/* Content Input */}
                {contentType === "file" ? (
                    <div>
                        <label htmlFor="file" className="block text-sm font-medium mb-2">
                            Upload File (.txt)
                        </label>
                        <input
                            type="file"
                            id="file"
                            ref={fileInputRef}
                            accept=".txt"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setFile(e.target.files[0]);
                                }
                            }}
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="textContent" className="block text-sm font-medium mb-2">
                            Text Content
                        </label>
                        <textarea
                            id="textContent"
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            className="w-full h-40 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Paste or type your content here..."
                            required
                        />
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-button text-white rounded-md font-medium hover:bg-button_hover disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating...' : 'Create Study Material'}
                </button>
            </form>
        </div>
    );
}