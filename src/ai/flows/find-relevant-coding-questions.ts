'use server';

/**
 * @fileOverview This file defines a Genkit flow to find relevant coding questions from various platforms based on a user's query.
 *
 * - findRelevantCodingQuestions - A function that takes a user query and returns a list of relevant coding questions.
 * - FindRelevantCodingQuestionsInput - The input type for the findRelevantCodingQuestions function.
 * - FindRelevantCodingQuestionsOutput - The return type for the findRelevantCodingQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindRelevantCodingQuestionsInputSchema = z.object({
  query: z.string().describe('The user query for coding questions.'),
});
export type FindRelevantCodingQuestionsInput = z.infer<
  typeof FindRelevantCodingQuestionsInputSchema
>;

const CodingQuestionSchema = z.object({
  title: z.string().describe('The title of the coding question.'),
  description: z.string().describe('A brief description of the coding question.'),
  link: z.string().url().describe('The link to the coding question on the platform.'),
  platform: z.string().describe('The coding platform (e.g., LeetCode, Codeforces).'),
  difficulty: z.string().describe('The difficulty level of the question (e.g., Easy, Medium, Hard).'),
});

const FindRelevantCodingQuestionsOutputSchema = z.array(CodingQuestionSchema);
export type FindRelevantCodingQuestionsOutput = z.infer<
  typeof FindRelevantCodingQuestionsOutputSchema
>;

export async function findRelevantCodingQuestions(
  input: FindRelevantCodingQuestionsInput
): Promise<FindRelevantCodingQuestionsOutput> {
  return findRelevantCodingQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findRelevantCodingQuestionsPrompt',
  input: {schema: FindRelevantCodingQuestionsInputSchema},
  output: {schema: FindRelevantCodingQuestionsOutputSchema},
  prompt: `You are an expert at finding coding questions from various online platforms that match a given user query.

  Based on the following query, find the most relevant coding questions from platforms like LeetCode, Codeforces, etc.

  Query: {{{query}}}

  Return a JSON array of coding questions, where each question includes the title, description, link, platform, and difficulty.
  The JSON should match this schema: 
  {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "The title of the coding question"
        },
        "description": {
          "type": "string",
          "description": "A brief description of the coding question."
        },
        "link": {
          "type": "string",
          "format": "url",
          "description": "The link to the coding question on the platform."
        },
        "platform": {
          "type": "string",
          "description": "The coding platform (e.g., LeetCode, Codeforces)."
        },
        "difficulty": {
          "type": "string",
          "description": "The difficulty level of the question (e.g., Easy, Medium, Hard)."
        }
      },
      "required": [
        "title",
        "description",
        "link",
        "platform",
        "difficulty"
      ]
    }
  }
  `,
});

const findRelevantCodingQuestionsFlow = ai.defineFlow(
  {
    name: 'findRelevantCodingQuestionsFlow',
    inputSchema: FindRelevantCodingQuestionsInputSchema,
    outputSchema: FindRelevantCodingQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
