
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import type { FindRelevantCodingQuestionsOutput } from '@/ai/flows/find-relevant-coding-questions';

type CodingQuestion = FindRelevantCodingQuestionsOutput[0];

interface QuestionCardProps {
  question: CodingQuestion;
}

export function QuestionCard({ question }: QuestionCardProps) {
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
      <CardFooter>
        <Button asChild size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <a href={question.link} target="_blank" rel="noopener noreferrer">
            View Question <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
