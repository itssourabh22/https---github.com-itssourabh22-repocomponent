import { AppHeader } from '@/components/app/app-header';
import { AnalysisForm } from '@/components/app/analysis-form';
import fs from 'fs';
import path from 'path';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { GitBranch, Github, PanelLeft } from 'lucide-react';
import Link from 'next/link';

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
    if (!fs.existsSync(repoDir)) {
      fs.mkdirSync(repoDir, { recursive: true });
    }
  }

  return (
    <>
      <Sidebar variant='inset' collapsible='icon' side='left'>
        <SidebarContent className="p-2">
          <SidebarHeader>
            <AppHeader />
          </SidebarHeader>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
           <SidebarTrigger className="md:hidden">
              <PanelLeft />
              <span className="sr-only">Toggle sidebar</span>
            </SidebarTrigger>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Repository Analysis</h1>
            </div>
            <Button asChild variant="outline" size="icon">
              <Link href="https://github.com/firebase/studio-code-jet-pack-compose" target="_blank">
                <Github />
                <span className='sr-only'>GitHub</span>
              </Link>
            </Button>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className='flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed mb-8 bg-card'>
               <div className='p-3 rounded-full bg-primary/10 border border-primary/20 mb-4'>
                <GitBranch className="h-8 w-8 text-primary" />
               </div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 font-headline">
                Understand Your Codebase
              </h1>
              <p className="text-lg text-muted-foreground">
                Select a local repository to automatically identify, categorize, and catalog all its components using AI.
              </p>
            </div>
            <AnalysisForm repositories={repositories} />
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
