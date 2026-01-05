

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, PlusCircle } from 'lucide-react';
import type { FindRelevantCodingQuestionsOutput } from '@/ai/flows/find-relevant-coding-questions';

type CodingQuestion = FindRelevantCodingQuestionsOutput[0];

interface QuestionCardProps {
  question: CodingQuestion;
  onAddToList: (question: CodingQuestion) => void;
  isAuth: boolean;
}

export function QuestionCard({ question, onAddToList, isAuth }: QuestionCardProps) {
  const getDifficultyBadgeVariant = (difficulty: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'secondary';
      case 'medium':
        return 'default';
      case 'hard':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold leading-snug">{question.title}</CardTitle>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline">{question.platform}</Badge>
          <Badge variant={getDifficultyBadgeVariant(question.difficulty)} className="capitalize">
            {question.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4">{question.description}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <a href={question.link} target="_blank" rel="noopener noreferrer">
            View Question <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button size="sm" variant="outline" onClick={() => onAddToList(question)} title={!isAuth ? "Sign in to add to list" : "Add to list"} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Add to List
        </Button>
      </CardFooter>
    </Card>
  );
}
