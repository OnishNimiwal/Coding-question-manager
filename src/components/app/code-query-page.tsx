
"use client";

import { useActionState, useEffect, useMemo, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { searchAction, type ActionState } from '@/app/actions';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/app/question-card';
import { FilterSection } from '@/components/app/filter-section';
import { QuestionSkeleton } from '@/components/app/question-skeleton';
import { Code2, Layers, Loader2, Search, Inbox, ListFilter, Cpu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const initialState: ActionState = {
  questions: [],
  message: undefined,
  error: false,
};

const ALL_PLATFORMS = [
    'LeetCode', 'HackerRank', 'Codeforces', 'TopCoder', 'CodeChef', 
    'GeeksforGeeks', 'AtCoder', 'HackerEarth', 'Spoj', 'Project Euler', 
    'Codewars', 'InterviewBit', 'Exercism', 'URI Online Judge', 'Kattis'
];
const ALL_DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Beginner', 'Advanced'];
const ALL_TOPICS = [
    'Array', 'String', 'Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 'Trie', 'Heap', 'Hash Table', 
    'Dynamic Programming', 'Backtracking', 'Greedy', 'Bit Manipulation', 'Math', 'Geometry', 'Sorting', 
    'Searching', 'Recursion', 'Divide and Conquer', 'Two Pointers', 'Sliding Window', 'Union Find',
    'Segment Tree', 'Fenwick Tree (Binary Indexed Tree)', 'Topological Sort', 'Minimum Spanning Tree',
    'Shortest Path', 'String Matching (KMP)', 'Game Theory', 'Computational Geometry'
];

export default function CodeQueryPage() {
  const [state, formAction, isPending] = useActionState(searchAction, initialState);
  const { toast } = useToast();

  const [platformFilters, setPlatformFilters] = useState<string[]>([]);
  const [difficultyFilters, setDifficultyFilters] = useState<string[]>([]);
  const [topicFilters, setTopicFilters] = useState<string[]>([]);
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (state.error && state.message && !isPending) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast, isPending]);

  const filteredQuestions = useMemo(() => {
    if (!state.questions) return [];
    return state.questions.filter(q => {
      const platformMatch = platformFilters.length === 0 || platformFilters.includes(q.platform);
      const difficultyMatch = difficultyFilters.length === 0 || difficultyFilters.some(f => f.toLowerCase() === q.difficulty.toLowerCase());
      // Assuming topics are in description or a new field. For now, we are not filtering by topic on the client side
      // as the backend does not return topic information. We will just show the filter.
      return platformMatch && difficultyMatch;
    });
  }, [state.questions, platformFilters, difficultyFilters]);

  useEffect(() => {
    setPlatformFilters([]);
    setDifficultyFilters([]);
    setTopicFilters([]);
  }, [state.questions]);

  const Filters = () => (
    <div className="space-y-4">
      <FilterSection
        title="Platforms"
        icon={<Layers className="h-4 w-4 text-muted-foreground" />}
        options={ALL_PLATFORMS}
        selected={platformFilters}
        onSelectionChange={setPlatformFilters}
      />
      <FilterSection
        title="Difficulty"
        icon={<ListFilter className="h-4 w-4 text-muted-foreground" />}
        options={ALL_DIFFICULTIES}
        selected={difficultyFilters}
        onSelectionChange={setDifficultyFilters}
      />
      <FilterSection
        title="Topics"
        icon={<Cpu className="h-4 w-4 text-muted-foreground" />}
        options={ALL_TOPICS}
        selected={topicFilters}
        onSelectionChange={setTopicFilters}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Code2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">CodeQuery</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <form action={formAction} className="flex gap-2 items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                name="query"
                placeholder="Search for coding questions like 'two sum', 'binary search'..."
                className="pl-10 h-12 text-base rounded-full"
                required
              />
            </div>
            <Button type="submit" disabled={isPending} className="h-12 text-base px-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Search />
              )}
               <span className="sr-only">Search</span>
            </Button>
          </form>
          {state.error && !isPending && (
             <p className="text-sm text-destructive mt-2 text-center">{state.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
             <div className="sticky top-24 space-y-6">
              <h2 className="text-lg font-semibold tracking-tight">Filters</h2>
              <Filters />
            </div>
          </aside>

          <div className="lg:col-span-3">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold tracking-tight">Results</h2>
                <div className="lg:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                            Refine your search results.
                        </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                        <Filters />
                        </div>
                    </SheetContent>
                    </Sheet>
                </div>
            </div>

            {isPending && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <QuestionSkeleton key={i} />)}
              </div>
            )}

            {!isPending && state.questions.length > 0 && (
                <>
                {filteredQuestions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredQuestions.map((q, i) => <QuestionCard key={`${q.link}-${i}`} question={q} />)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-16 border rounded-lg bg-card">
                        <ListFilter className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Matching Results</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Try adjusting your filters to see more questions.
                        </p>
                    </div>
                )}
                </>
            )}
            
            {!isPending && state.questions.length === 0 && state.message && (
              <div className="flex flex-col items-center justify-center text-center py-16 border rounded-lg bg-card">
                <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Questions Found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {state.message}
                </p>
              </div>
            )}

            {!isPending && state.questions.length === 0 && !state.message && (
              <div className="flex flex-col items-center justify-center text-center py-16 border rounded-lg bg-card">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Find Your Next Challenge</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter a topic or question name to start searching.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
