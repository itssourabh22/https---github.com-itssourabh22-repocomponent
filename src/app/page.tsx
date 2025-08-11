import { AppHeader } from '@/components/app/app-header';
import { AnalysisForm } from '@/components/app/analysis-form';

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center tracking-tight mb-2 font-headline">
            Understand Your Codebase
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-8">
            Paste your entire repository contents as a single block of text to
            automatically identify, categorize, and catalog all components.
          </p>
          <AnalysisForm />
        </div>
      </main>
    </>
  );
}
