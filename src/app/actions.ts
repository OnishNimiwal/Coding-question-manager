
'use server';

import { z } from 'zod';
import { findRelevantCodingQuestions } from '@/ai/flows/find-relevant-coding-questions';
import type { FindRelevantCodingQuestionsOutput } from '@/ai/flows/find-relevant-coding-questions';

export type ActionState = {
  questions: FindRelevantCodingQuestionsOutput;
  message?: string;
  error?: boolean;
};

const searchSchema = z.object({
  query: z.string().min(3, { message: 'Search query must be at least 3 characters.' }),
});

export async function searchAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = searchSchema.safeParse({
    query: formData.get('query'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      questions: [],
      error: true,
      message: validatedFields.error.flatten().fieldErrors.query?.[0] || 'Invalid search query.',
    };
  }

  try {
    const questions = await findRelevantCodingQuestions({ query: validatedFields.data.query });
    
    if (questions.length === 0) {
      return {
        questions: [],
        message: 'No questions found. Try a different search query.',
      };
    }
    
    return {
      questions,
      message: undefined,
    };
  } catch (error) {
    console.error(error);
    return {
      ...prevState,
      questions: [],
      error: true,
      message: 'An error occurred while searching. Please try again.',
    };
  }
}
