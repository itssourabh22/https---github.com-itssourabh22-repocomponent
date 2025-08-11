
'use server';

import { analyzeRepository, AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';
import { z } from 'zod';

const FormSchema = z.object({
  repositoryContents: z.string({
    invalid_type_error: 'Please provide the repository contents.',
  }).min(100, { message: 'Repository contents must be at least 100 characters to provide a meaningful analysis.' }),
});

export interface AnalyzeState {
  message?: string;
  result?: AnalyzeRepositoryOutput;
  error?: string;
}

export async function analyzeRepositoryAction(
  prevState: AnalyzeState,
  formData: FormData,
): Promise<AnalyzeState> {
  const validatedFields = FormSchema.safeParse({
    repositoryContents: formData.get('repositoryContents'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid Input',
      message: validatedFields.error.flatten().fieldErrors.repositoryContents?.join(', '),
    };
  }
  
  try {
    const result = await analyzeRepository(validatedFields.data);
    return { result, message: 'Analysis successful.' };
  } catch (e: any) {
    console.error(e);
    return { error: 'Analysis Failed', message: e.message || 'An unknown error occurred while analyzing the repository.' };
  }
}
