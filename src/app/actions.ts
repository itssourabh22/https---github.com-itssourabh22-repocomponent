
'use server';

import { analyzeRepository, AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const FormSchema = z.object({
  repository: z.string().min(1, { message: 'Please select a repository.' }),
  model: z.string().min(1, { message: 'Please select a model.' }),
  apiKey: z.string().optional(),
  fileCount: z.string(),
});

export interface AnalyzeState {
  message?: string;
  result?: AnalyzeRepositoryOutput;
  error?: string;
}

async function getRepositoryContents(repoName: string, fileCount: string): Promise<string> {
  const repoPath = path.join(process.cwd(), 'public', 'repo', repoName);
  const allFiles: string[] = [];

  async function readDirectory(dir: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
          continue;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await readDirectory(fullPath);
        } else if (entry.isFile()) {
          allFiles.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Could not read directory: ${dir}`, error);
    }
  }

  await readDirectory(repoPath);

  const count = fileCount === 'all' ? allFiles.length : parseInt(fileCount, 10);
  const filesToProcess = allFiles.slice(0, count);
  
  let fileContents = '';
  for (const filePath of filesToProcess) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      fileContents += `--- File: ${path.relative(repoPath, filePath)} ---\n${content}\n\n`;
    } catch (error) {
      console.error(`Could not read file: ${filePath}`, error);
    }
  }

  return fileContents;
}


export async function analyzeRepositoryAction(
  prevState: AnalyzeState,
  formData: FormData,
): Promise<AnalyzeState> {
  const validatedFields = FormSchema.safeParse({
    repository: formData.get('repository'),
    model: formData.get('model'),
    apiKey: formData.get('apiKey'),
    fileCount: formData.get('fileCount'),
  });

  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0]
    return {
      error: 'Invalid Input',
      message: firstError || 'Please check your input and try again.',
    };
  }

  const { repository, model, apiKey, fileCount } = validatedFields.data;

  try {
    const repositoryContents = await getRepositoryContents(repository, fileCount);
    
    if (repositoryContents.length < 10) {
       return {
            error: 'Empty Repository',
            message: 'The selected repository is empty or contains no files.',
        };
    }
    
    const result = await analyzeRepository({ repositoryContents, model, apiKey });
    return { result, message: 'Analysis successful.' };
  } catch (e: any) {
    console.error(e);
    if (e.code === 'ENOENT') {
        return { error: 'Repository Not Found', message: `The directory for "${repository}" could not be found.` };
    }
    return { error: 'Analysis Failed', message: e.message || 'An unknown error occurred while analyzing the repository.' };
  }
}
