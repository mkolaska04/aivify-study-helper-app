'use client'
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const user = session?.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <nav className="bg-surface border-b border-outline z-0 fixed w-full">
            <div className="container mx-auto px-4">
                <ul className="flex items-center justify-between py-4">
                    <div className="lg:hidden w-full">
                        <div className="flex items-between justify-between w-full">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}><MenuIcon /></button> 
                             <div className="flex items-center gap-4">
                                Aivify
                        {!isLoading && (
                            user ? (
                                <>
                                    <span  onClick={() => {router.push("/profile"); setIsMenuOpen(false);}} 
                                            className="cursor-pointer hover:text-primary transition-colors">
                                        <Image src={user.image || '/default-avatar.png'} alt="Avatar" width={32} height={32} className="rounded-full inline-block mr-2" />
                                        {user.name || user.email}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-error text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => signIn('google')}
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        Login with Google
                                    </button>
                                </>
                            )
                        )}
                    </div>
                        </div>
                       
                        <div className={`${isMenuOpen ? 'block' : 'hidden'} mt-2 bg-surface p-4 rounded-md shadow-md`}>
                            Aivify
                             <li 
                            onClick={() => {router.push("/"); setIsMenuOpen(false);}} 
                            className="cursor-pointer hover:text-primary transition-colors font-semibold"
                        >
                            Home
                        </li>
                        {user && (
                            <>
                                <li 
                                    onClick={() => {router.push("/add-new"); setIsMenuOpen(false);}} 
                                    className="cursor-pointer hover:text-primary transition-colors"
                                >
                                    Add New
                                </li>
                                <li 
                                    onClick={() => {router.push("/summaries"); setIsMenuOpen(false);}} 
                                    className="cursor-pointer hover:text-primary transition-colors"
                                >
                                    Summaries
                                </li>
                                <li 
                                    onClick={() => {router.push("/quizzes"); setIsMenuOpen(false);}} 
                                    className="cursor-pointer hover:text-primary transition-colors"
                                >
                                    Quizzes
                                </li>
                                <li 
                                        onClick={() => {
                                            router.push("/flashcards");
                                            setIsMenuOpen(false);
                                        }} 
                                    className="cursor-pointer hover:text-primary transition-colors"
                                >
                                    Flashcards
                                    </li>
                                   
                            </>
                        )}
                        </div>
                        
                    </div>
                    <div className=" hidden lg:flex items-center gap-6">
                        <h1>Aivify</h1>
                        <li 
                            onClick={() => router.push("/")} 
                            className="cursor-pointer hover:text-primary transition-colors font-semibold"
                        >
                            Home
                        </li>
                        {user && (
                            <>
                                <li 
                                    onClick={() => router.push("/add-new")} 
                                    className="cursor-pointer hover:text-primary transition-colors"
                                >
                                    Add New
                                </li>
                                <li 
                                    onClick={() => router.push("/summaries")} 
                                    className="cursor-pointer hover:text-primary transition-colors"
                                >
                                    Summaries
                                </li>
                                <li 
                                    onClick={() => router.push("/quizzes")} 
                                    className="cursor-pointer hover:text-primary transition-colors"
                                >
                                    Quizzes
                                </li>
                                <li 
                                    onClick={() => router.push("/flashcards")} 
                                    className="cursor-pointer hover:text-primary transition-colors"
                                >
                                    Flashcards
                                </li>
                               
                            </>
                        )}
                    </div>
                    
                    <div className=" hidden lg:flex items-center gap-4">
                        {!isLoading && (
                            user ? (
                                <>
                                    <span  onClick={() => router.push("/profile")} 
                                            className="cursor-pointer hover:text-primary transition-colors">
                                        <Image src={user.image || '/default-avatar.png'} alt="Avatar" width={32} height={32} className="rounded-full inline-block mr-2" />
                                        {user.name || user.email}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-error text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => signIn('google')}
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        Login with Google
                                    </button>
                                </>
                            )
                        )}
                    </div>
                </ul>
            </div>
        </nav>
    );
}