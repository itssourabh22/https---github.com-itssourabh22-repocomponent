
'use server';

import { analyzeRepository, AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const FormSchema = z.object({
  repository: z.string().min(1, { message: 'Please select a repository.' }),
});

export interface AnalyzeState {
  message?: string;
  result?: AnalyzeRepositoryOutput;
  error?: string;
}

async function getRepositoryContents(repoName: string): Promise<string> {
  const repoPath = path.join(process.cwd(), 'public', 'repo', repoName);
  let fileContents = '';

  async function readDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await readDirectory(fullPath);
      } else if (entry.isFile()) {
        const content = await fs.readFile(fullPath, 'utf-8');
        fileContents += `--- File: ${path.relative(repoPath, fullPath)} ---\n${content}\n\n`;
      }
    }
  }

  await readDirectory(repoPath);
  return fileContents;
}


export async function analyzeRepositoryAction(
  prevState: AnalyzeState,
  formData: FormData,
): Promise<AnalyzeState> {
  const validatedFields = FormSchema.safeParse({
    repository: formData.get('repository'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid Input',
      message: validatedFields.error.flatten().fieldErrors.repository?.join(', '),
    };
  }

  try {
    const repositoryContents = await getRepositoryContents(validatedFields.data.repository);
    
    if (repositoryContents.length < 10) {
       return {
            error: 'Empty Repository',
            message: 'The selected repository is empty or contains no files.',
        };
    }
    
    const result = await analyzeRepository({ repositoryContents });
    return { result, message: 'Analysis successful.' };
  } catch (e: any) {
    console.error(e);
    if (e.code === 'ENOENT') {
        return { error: 'Repository Not Found', message: `The directory for "${validatedFields.data.repository}" could not be found.` };
    }
    return { error: 'Analysis Failed', message: e.message || 'An unknown error occurred while analyzing the repository.' };
  }
}
