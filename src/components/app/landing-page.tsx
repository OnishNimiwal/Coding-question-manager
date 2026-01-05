
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart, CheckCircle, Code2, List, Search, Star } from 'lucide-react';
import { DifficultyChart } from '@/components/app/difficulty-chart';
import { StatusChart } from '@/components/app/status-chart';
import { ImportanceChart } from '@/components/app/importance-chart';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';

const sampleDifficultyData = [
  { name: 'Easy', value: 12, fill: 'hsl(var(--chart-2))' },
  { name: 'Medium', value: 25, fill: 'hsl(var(--chart-4))' },
  { name: 'Hard', value: 8, fill: 'hsl(var(--chart-1))' },
];

const sampleStatusData = [
  { name: 'Solved', value: 20, fill: 'hsl(var(--chart-2))' },
  { name: 'Unsolved', value: 25, fill: 'hsl(var(--chart-1))' },
];

const sampleImportanceData = [
    { name: 'Important', value: 15, fill: 'hsl(var(--chart-4))' },
    { name: 'Normal', value: 30, fill: 'hsl(var(--muted))' },
];

const sampleSearches = [
    'two pointers', 'dynamic programming', 'binary search on answer', 
    'graph traversal', 'string manipulation', 'tree algorithms'
];

export default function LandingPage() {
    const { user, loading: userLoading } = useUser();

  const UserButton = () => {
    if (userLoading) {
      return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
    }

    if (!user) {
      return (
        <Button asChild>
          <Link href="/search">Get Started</Link>
        </Button>
      );
    }

    return (
        <div className="flex items-center gap-4">
            <Button asChild variant="outline">
                <Link href="/my-list">Go to Your List</Link>
            </Button>
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
                <DropdownMenuItem asChild>
                    <Link href="/my-list">My List</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                     <Link href="/search">Search</Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
  };
    
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Code2 className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold tracking-tight">CodeQuery</h1>
                </Link>
                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex items-center gap-4">
                        <Link href="/search" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                            <Search className="h-4 w-4" />
                            Search
                        </Link>
                        <Link href="/my-list" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
                            <List className="h-4 w-4" />
                            My List
                        </Link>
                    </nav>
                     <UserButton />
                </div>
            </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-28 md:py-32">
          <div className="container text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Find, Track, and Master Any Coding Problem
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              CodeQuery uses AI to find relevant coding questions from any platform. Save them to your list, track your progress, add notes, and conquer your technical interviews.
            </p>
            <Button asChild size="lg">
                <Link href="/search">
                    Start Searching Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Why You'll Love CodeQuery</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Search</h3>
                <p className="text-muted-foreground">
                  Describe the problem you want to solve, and our AI will find the most relevant questions from a vast array of platforms.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <List className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Lists</h3>
                <p className="text-muted-foreground">
                  Save questions to your personal list, mark them as important, and track their status (solved or unsolved).
                </p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <BarChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visualize Your Progress</h3>
                <p className="text-muted-foreground">
                  Interactive charts help you visualize your progress, showing breakdowns by difficulty, status, and importance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Charts Section */}
        <section className="py-16 sm:py-20">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-12">Powerful Dashboard at a Glance</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <DifficultyChart data={sampleDifficultyData} />
                    <StatusChart data={sampleStatusData} onSegmentClick={() => {}} />
                    <ImportanceChart data={sampleImportanceData} />
                </div>
            </div>
        </section>

         {/* Sample Searches Section */}
        <section className="py-16 sm:py-20 bg-muted/50">
            <div className="container text-center">
                 <h2 className="text-3xl font-bold mb-8">Ready to Find Your Next Challenge?</h2>
                 <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    Click on any topic to see what CodeQuery can find for you.
                 </p>
                 <div className="flex flex-wrap justify-center gap-3">
                    {sampleSearches.map(search => (
                        <Button variant="outline" asChild key={search}>
                            <Link href={`/search?q=${encodeURIComponent(search)}`}>
                                {search}
                            </Link>
                        </Button>
                    ))}
                 </div>
            </div>
        </section>

      </main>

       <footer className="py-6 border-t">
            <div className="container flex items-center justify-between">
                <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} CodeQuery. All rights reserved.</p>
                <div className="flex items-center gap-4">
                     <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">
                        Search
                    </Link>
                     <Link href="/my-list" className="text-sm text-muted-foreground hover:text-foreground">
                        My List
                    </Link>
                </div>
            </div>
       </footer>
    </div>
  );
}
