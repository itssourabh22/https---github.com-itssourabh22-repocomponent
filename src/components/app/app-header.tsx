import { GitBranch } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <GitBranch className="h-6 w-6 text-primary" />
            <span className="font-headline">RepoSight</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
