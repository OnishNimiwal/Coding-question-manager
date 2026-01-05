
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StickyNote } from 'lucide-react';
import Link from 'next/link';

interface NotesOverviewProps {
  questions: any[];
}

export function NotesOverview({ questions }: NotesOverviewProps) {
  const questionsWithNotes = questions.filter(q => q.notes && q.notes.trim() !== '');

  if (questionsWithNotes.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <StickyNote className="h-6 w-6" />
          All Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {questionsWithNotes.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {questionsWithNotes.map(question => (
              <AccordionItem key={question.id} value={question.id}>
                <AccordionTrigger className="text-base font-medium hover:no-underline">
                  {question.title}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground whitespace-pre-wrap px-4 py-2 bg-muted/50 rounded-md">
                  {question.notes}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground">You haven't written any notes yet. Add notes to your questions to see them here.</p>
        )}
      </CardContent>
    </Card>
  );
}
