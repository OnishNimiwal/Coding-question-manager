'use server';
/**
 * @fileOverview Summarizes a coding question and assesses its relevance to a search query.
 *
 * - summarizeQuestionForRelevance - A function that summarizes a coding question and its relevance.
 * - SummarizeQuestionForRelevanceInput - The input type for the summarizeQuestionForRelevance function.
 * - SummarizeQuestionForRelevanceOutput - The return type for the summarizeQuestionForRelevance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeQuestionForRelevanceInputSchema = z.object({
  questionTitle: z.string().describe('The title of the coding question.'),
  questionDescription: z.string().describe('The description of the coding question.'),
  searchQuery: z.string().describe('The user search query.'),
});
export type SummarizeQuestionForRelevanceInput = z.infer<
  typeof SummarizeQuestionForRelevanceInputSchema
>;

const SummarizeQuestionForRelevanceOutputSchema = z.object({
  summary: z.string().describe('A short summary of the coding question.'),
  relevance: z
    .string()
    .describe(
      'An assessment of how relevant the question is to the search query.'
    ),
});
export type SummarizeQuestionForRelevanceOutput = z.infer<
  typeof SummarizeQuestionForRelevanceOutputSchema
>;

export async function summarizeQuestionForRelevance(
  input: SummarizeQuestionForRelevanceInput
): Promise<SummarizeQuestionForRelevanceOutput> {
  return summarizeQuestionForRelevanceFlow(input);
}

const summarizeQuestionForRelevancePrompt = ai.definePrompt({
  name: 'summarizeQuestionForRelevancePrompt',
  input: {schema: SummarizeQuestionForRelevanceInputSchema},
  output: {schema: SummarizeQuestionForRelevanceOutputSchema},
  prompt: `You are an expert at summarizing coding questions and assessing their relevance to a search query.

  Summarize the coding question below, and assess how relevant it is to the search query. Provide the summary and relevance assessment in the output schema.

  Search Query: {{{searchQuery}}}
  Question Title: {{{questionTitle}}}
  Question Description: {{{questionDescription}}}`,
});

const summarizeQuestionForRelevanceFlow = ai.defineFlow(
  {
    name: 'summarizeQuestionForRelevanceFlow',
    inputSchema: SummarizeQuestionForRelevanceInputSchema,
    outputSchema: SummarizeQuestionForRelevanceOutputSchema,
  },
  async input => {
    const {output} = await summarizeQuestionForRelevancePrompt(input);
    return output!;
  }
);
