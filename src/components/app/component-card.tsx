import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Server, Library, Database, AppWindow, Webhook } from 'lucide-react';
import type { AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';

type Component = AnalyzeRepositoryOutput['components'][0];

interface ComponentCardProps {
  component: Component;
}

const getIconForType = (type: string) => {
  const T = type.toLowerCase();
  if (T.includes('service')) return <Server className="h-6 w-6 text-muted-foreground" />;
  if (T.includes('library') || T.includes('package')) return <Library className="h-6 w-6 text-muted-foreground" />;
  if (T.includes('database') || T.includes('resource') || T.includes('storage')) return <Database className="h-6 w-6 text-muted-foreground" />;
  if (T.includes('api')) return <Webhook className="h-6 w-6 text-muted-foreground" />;
  return <AppWindow className="h-6 w-6 text-muted-foreground" />;
};


export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Link href={`/component/${encodeURIComponent(component.name)}`} className="h-full">
      <Card className="h-full flex flex-col hover:border-primary transition-colors group bg-card">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="font-headline">{component.name}</CardTitle>
              <CardDescription className="pt-1">{component.type}</CardDescription>
            </div>
            {getIconForType(component.type)}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{component.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Badge variant="secondary">{component.language}</Badge>
          <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            View Details <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
