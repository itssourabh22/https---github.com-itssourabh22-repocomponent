import { AppHeader } from '@/components/app/app-header';
import { AnalysisForm } from '@/components/app/analysis-form';
import fs from 'fs';
import path from 'path';

export default async function Home() {
  const repoDir = path.join(process.cwd(), 'public', 'repo');
  let repositories: string[] = [];
  try {
    const entries = await fs.promises.readdir(repoDir, { withFileTypes: true });
    repositories = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    console.warn('Could not read repositories from public/repo. Does the directory exist?', error);
    // You might want to create the directory if it doesn't exist.
    if (!fs.existsSync(repoDir)) {
      fs.mkdirSync(repoDir, { recursive: true });
    }
  }


  return (
    <>
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center tracking-tight mb-2 font-headline">
            Understand Your Codebase
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Select a repository from the `public/repo` directory to
            automatically identify, categorize, and catalog all its components.
          </p>
          <AnalysisForm repositories={repositories} />
        </div>
      </main>
    </>
  );
}
