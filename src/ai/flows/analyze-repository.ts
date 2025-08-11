// This file uses server-side code, must include this directive.
'use server';

/**
 * @fileOverview Repository analysis flow using GenAI.
 *
 * - analyzeRepository - Analyzes a code repository to identify, categorize, and catalog components.
 * - AnalyzeRepositoryInput - The input type for the analyzeRepository function.
 * - AnalyzeRepositoryOutput - The return type for the analyzeRepository function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeRepositoryInputSchema = z.object({
  repositoryContents: z.string().describe('The entire contents of the repository as a single string.'),
});

export type AnalyzeRepositoryInput = z.infer<typeof AnalyzeRepositoryInputSchema>;

const AnalyzeRepositoryOutputSchema = z.object({
  components: z.array(
    z.object({
      name: z.string().describe('The name of the component.'),
      description: z.string().describe('A brief description of the component.'),
      type: z.string().describe('The type of the component (e.g., service, library, resource, system).'),
      language: z.string().describe('The programming language of the component.'),
      dependencies: z.array(z.string()).describe('A list of the component\'s dependencies.'),
    })
  ).describe('A list of components identified in the repository.'),
});

export type AnalyzeRepositoryOutput = z.infer<typeof AnalyzeRepositoryOutputSchema>;

export async function analyzeRepository(input: AnalyzeRepositoryInput): Promise<AnalyzeRepositoryOutput> {
  return analyzeRepositoryFlow(input);
}

const analyzeRepositoryPrompt = ai.definePrompt({
  name: 'analyzeRepositoryPrompt',
  input: {schema: AnalyzeRepositoryInputSchema},
  output: {schema: AnalyzeRepositoryOutputSchema},
  prompt: `You are an expert software architect responsible for analyzing code repositories and identifying, categorizing, and cataloging components within the codebase.

  Analyze the following repository contents and identify the components, their types, programming languages, and dependencies.  Consider file structure, import/export statements, class definitions, configuration files, documentation patterns and naming conventions.

  Repository Contents:
  {{repositoryContents}}

  Return a JSON array of components with the following properties:
  - name: The name of the component.
  - description: A brief description of the component.
  - type: The type of the component (e.g., service, library, resource, system).
  - language: The programming language of the component.
  - dependencies: A list of the component's dependencies.
  `,
});

const analyzeRepositoryFlow = ai.defineFlow(
  {
    name: 'analyzeRepositoryFlow',
    inputSchema: AnalyzeRepositoryInputSchema,
    outputSchema: AnalyzeRepositoryOutputSchema,
  },
  async input => {
    const {output} = await analyzeRepositoryPrompt(input);
    return output!;
  }
);
