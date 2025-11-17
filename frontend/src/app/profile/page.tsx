'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ThemeToggle } from '@/src/components/ThemeToggle';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const user = session?.user;
    const isLoading = status === 'loading';

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6"> 
                {user.image && <Image src={user.image} alt="Profile" width={64} height={64} className="w-16 h-16 rounded-full" />}
                <h1 className="text-3xl font-bold text-text">Profile</h1>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-muted mb-1">Name</label>
                    <p className="text-text text-lg">{user.name || 'Not provided'}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted mb-1">Email</label>
                    <p className="text-text text-lg">{user.email}</p>
                </div>

                <ThemeToggle />
            </div>
        </div>
    );
}
