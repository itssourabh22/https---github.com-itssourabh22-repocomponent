import { GitBranch } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <Link href="/" className="group flex items-center gap-2 font-bold text-lg text-sidebar-foreground">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground transition-colors group-hover:bg-sidebar-primary group-hover:text-sidebar-primary-foreground">
        <GitBranch className="h-5 w-5" />
      </div>
      <span className="font-headline text-lg group-data-[collapsible=icon]:hidden">RepoSight</span>
    </Link>
  );
}
