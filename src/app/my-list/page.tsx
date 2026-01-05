
'use client';

import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase';
import { Code2, List, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
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


export default function MyListPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const auth = getAuth();
    const { toast } = useToast();

    const questionsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'userQuestions'), where('userId', '==', user.uid));
    }, [user, firestore]);

    const { data: questions, loading: questionsLoading } = useCollection(questionsQuery);

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "Could not sign you in. Please try again.",
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
    
    const UserButton = () => {
        if (userLoading) {
          return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
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
                <User className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };

    const renderContent = () => {
        if (userLoading || (user && questionsLoading)) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                </div>
            );
        }

        if (!user) {
            return (
                <div className="text-center">
                    <p className="mb-4">Please log in to see your list of questions.</p>
                </div>
            );
        }

        if (questions && questions.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {questions.map((q) => (
                        <MyListCard key={q.id} question={q} />
                    ))}
                </div>
            );
        }

        return (
            <div className="text-center border-2 border-dashed border-muted-foreground/30 rounded-lg py-16">
                <h2 className="text-xl font-semibold mb-2">Your list is empty</h2>
                <p className="text-muted-foreground mb-4">
                    Go to the main page to search for questions and add them to your list.
                </p>
                <Button asChild>
                    <Link href="/">
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
                <h1 className="text-3xl font-bold mb-8">My Question List</h1>
                {renderContent()}
            </main>
        </div>
    );
}
