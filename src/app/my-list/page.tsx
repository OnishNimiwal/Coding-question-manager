
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { Code2, List, LogIn, FilterX } from 'lucide-react';
import Link from 'next/link';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where } from 'firebase/firestore';
import { MyListCard } from '@/components/app/my-list-card';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCard } from '@/components/app/stats-card';
import { DifficultyChart } from '@/components/app/difficulty-chart';
import { StatusChart } from '@/components/app/status-chart';
import { ImportanceChart } from '@/components/app/importance-chart';
import { NotesOverview } from '@/components/app/notes-overview';
import { useMemo, useState } from 'react';


type FilterType = 'all' | 'solved' | 'unsolved' | 'important';

export default function MyListPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const auth = getAuth();
    const { toast } = useToast();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const questionsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'userQuestions'), where('userId', '==', user.uid));
    }, [user, firestore]);

    const { data: questions, isLoading: questionsLoading } = useCollection(questionsQuery);

    const filteredQuestions = useMemo(() => {
        if (!questions) return [];
        switch (activeFilter) {
            case 'important':
                return questions.filter(q => q.isImportant);
            case 'solved':
                return questions.filter(q => q.status === 'solved');
            case 'unsolved':
                return questions.filter(q => q.status === 'unsolved');
            case 'all':
            default:
                return questions;
        }
    }, [questions, activeFilter]);

    const stats = useMemo(() => {
        if (!questions) return { total: 0, solved: 0, important: 0, unsolved: 0, byDifficulty: [], statusDistribution: [], importanceDistribution: [] };
    
        const total = questions.length;
        const solved = questions.filter(q => q.status === 'solved').length;
        const important = questions.filter(q => q.isImportant).length;
        const unsolved = total - solved;

        const byDifficulty = questions.reduce((acc, q) => {
            const difficulty = q.difficulty || 'N/A';
            const existing = acc.find(item => item.name === difficulty);
            if (existing) {
                existing.value += 1;
            } else {
                acc.push({ name: difficulty, value: 1 });
            }
            return acc;
        }, [] as { name: string; value: number }[]);

        const statusDistribution = [
            { name: 'Solved', value: solved, fill: 'hsl(var(--chart-2))' },
            { name: 'Unsolved', value: unsolved, fill: 'hsl(var(--chart-1))' },
        ];

        const importanceDistribution = [
            { name: 'Important', value: important, fill: 'hsl(var(--chart-4))' },
            { name: 'Normal', value: total - important, fill: 'hsl(var(--muted))' },
        ];
    
        return { total, solved, important, unsolved, byDifficulty, statusDistribution, importanceDistribution };
    }, [questions]);

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any)
{
            console.error("Error signing in with Google", error);
            let description = "Could not sign you in. Please try again.";
            if (error.code === 'auth/operation-not-allowed') {
                description = "Google Sign-In is not enabled for this project. Please enable it in the Firebase console.";
            } else if (error.code === 'auth/popup-closed-by-user') {
                description = "Sign-in cancelled. Please try again.";
            }
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: description,
            });
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const getFilterTitle = () => {
        switch (activeFilter) {
            case 'important': return "Important Questions";
            case 'solved': return "Solved Questions";
            case 'unsolved': return "Unsolved Questions";
            default: return "Your Questions";
        }
    }
    
    const UserButton = () => {
        if (userLoading) {
          return <Skeleton className="h-9 w-9 rounded-full" />;
        }
    
        if (!user) {
          return (
            <Button onClick={handleLogin} variant="outline" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          );
        }
    
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };
      
    const renderContent = () => {
        if (userLoading) {
            return (
                <div className="text-center p-8">
                    <p>Loading your list...</p>
                </div>
            );
        }

        if (!user) {
            return (
                <div className="text-center border-2 border-dashed border-muted-foreground/30 rounded-lg py-16 mt-8">
                    <h2 className="text-xl font-semibold mb-2">Please log in</h2>
                    <p className="text-muted-foreground mb-4">Log in to see your list of saved questions.</p>
                     <Button onClick={handleLogin}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login with Google
                    </Button>
                </div>
            );
        }

        if (questionsLoading) {
            return (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                       {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
                    </div>
                    <Skeleton className="h-40 w-full mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-96 rounded-lg" />
                        ))}
                    </div>
                </>
            );
        }

        if (questions && questions.length > 0) {
            return (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div onClick={() => setActiveFilter('all')} className="cursor-pointer">
                            <StatsCard title="Total Questions" value={stats.total} icon={<List />} />
                        </div>
                         <div className="cursor-pointer" onClick={() => setActiveFilter('important')}>
                            <ImportanceChart data={stats.importanceDistribution} />
                        </div>
                        <div className="cursor-pointer" onClick={() => setActiveFilter(activeFilter === 'solved' ? 'all' : 'solved')}>
                            <StatusChart data={stats.statusDistribution} onSegmentClick={setActiveFilter} />
                        </div>
                        <DifficultyChart data={stats.byDifficulty} />
                    </div>
                    <NotesOverview questions={questions} />
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold tracking-tight">{getFilterTitle()} ({filteredQuestions.length})</h2>
                            {activeFilter !== 'all' && (
                                <Button variant="ghost" onClick={() => setActiveFilter('all')}>
                                    <FilterX className="mr-2 h-4 w-4" />
                                    Clear Filter
                                </Button>
                            )}
                        </div>
                        {filteredQuestions.length > 0 ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredQuestions.map((q) => (
                                    <MyListCard key={q.id} question={q} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center border-2 border-dashed border-muted-foreground/30 rounded-lg py-16">
                                <h2 className="text-xl font-semibold mb-2">No questions match your filter</h2>
                                <p className="text-muted-foreground mb-4">
                                    Clear the filter to see all your questions.
                                </p>
                                <Button onClick={() => setActiveFilter('all')}>
                                    <FilterX className="mr-2 h-4 w-4" />
                                    Clear Filter
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center border-2 border-dashed border-muted-foreground/30 rounded-lg py-16 mt-8">
                <h2 className="text-xl font-semibold mb-2">Your list is empty</h2>
                <p className="text-muted-foreground mb-4">
                    Go to the main page to search for questions and add them to your list.
                </p>
                <Button asChild>
                    <Link href="/search">
                        <Code2 className="mr-2 h-4 w-4" />
                        Find Questions
                    </Link>
                </Button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
             <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Code2 className="h-8 w-8 text-primary" />
                            <h1 className="text-2xl font-bold tracking-tight">CodeQuery</h1>
                        </Link>
                        <nav className="hidden md:flex items-center gap-4">
                            <Link href="/search" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                                <Code2 className="h-4 w-4" />
                                Search
                            </Link>
                            <Link href="/my-list" className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-foreground/80">
                                <List className="h-4 w-4" />
                                My List
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserButton />
                    </div>
                </div>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Question List</h1>
                     {user && !questionsLoading && questions && questions.length > 0 && (
                        <Button asChild variant="outline">
                            <Link href="/search">
                                <Code2 className="mr-2 h-4 w-4" />
                                Add More Questions
                            </Link>
                        </Button>
                    )}
                </div>
                {renderContent()}
            </main>
        </div>
    );
}
