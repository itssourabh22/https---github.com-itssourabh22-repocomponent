'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, GitBranch, Share2 } from 'lucide-react';
import type { AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';
import { AppHeader } from '@/components/app/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

type Component = AnalyzeRepositoryOutput['components'][0];

export default function ComponentDetail() {
  const router = useRouter();
  const params = useParams();
  const componentName = params.name ? decodeURIComponent(params.name as string) : '';
  const [component, setComponent] = useState<Component | null>(null);
  const [dependents, setDependents] = useState<Component[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResult = sessionStorage.getItem('analysisResult');
      if (storedResult) {
        const result: AnalyzeRepositoryOutput = JSON.parse(storedResult);
        const currentComponent = result.components.find(c => c.name === componentName);
        setComponent(currentComponent || null);

        if (currentComponent) {
          const componentDependents = result.components.filter(c => c.dependencies?.includes(currentComponent.name));
          setDependents(componentDependents);
        }
      }
    }
  }, [componentName]);

  if (!component) {
    return (
      <>
        <AppHeader />
        <main className="container mx-auto px-4 py-8 text-center flex-1 flex flex-col items-center justify-center">
          <GitBranch className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold font-headline">Component Not Found</h1>
          <p className="text-muted-foreground mt-2">The component data could not be loaded. Please run an analysis first.</p>
          <Button onClick={() => router.push('/')} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Analysis
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-headline">{component.name}</CardTitle>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Type: {component.type}</Badge>
                  <Badge variant="outline">Language: {component.language}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Automatically extracted documentation would appear here. For this demo, we're using the component's AI-generated description.</p>
                <blockquote className="mt-4 border-l-2 pl-6 italic">
                  {component.description}
                </blockquote>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Share2 className="h-5 w-5" /> Relationships
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Dependencies ({component.dependencies?.length || 0})</h4>
                  {component.dependencies && component.dependencies.length > 0 ? (
                    <ul className="space-y-2">
                      {component.dependencies.map(dep => (
                        <li key={dep}>
                          <Link href={`/component/${encodeURIComponent(dep)}`} className="text-primary hover:underline">{dep}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No dependencies identified.</p>
                  )}
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Dependents ({dependents.length})</h4>
                  {dependents.length > 0 ? (
                    <ul className="space-y-2">
                      {dependents.map(dep => (
                        <li key={dep.name}>
                          <Link href={`/component/${encodeURIComponent(dep.name)}`} className="text-primary hover:underline">{dep.name}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not used by any other identified components.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
