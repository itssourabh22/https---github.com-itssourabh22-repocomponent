'use client';

import React from 'react';
import type { AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Share2 } from 'lucide-react';
import Link from 'next/link';

type Component = AnalyzeRepositoryOutput['components'][0];

interface SystemMapProps {
  components: Component[];
}

export function SystemMap({ components }: SystemMapProps) {
  if (!components || components.length === 0) {
    return <p>No components to display in the map.</p>;
  }

  const componentsWithDeps = components.filter(c => c.dependencies && c.dependencies.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Component Relationships</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {componentsWithDeps.length > 0 ? componentsWithDeps.map(component => (
          <div key={component.name} className="p-4 border rounded-lg bg-background">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <Link href={`/component/${encodeURIComponent(component.name)}`} className="hover:underline">
                {component.name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">depends on:</p>
            <ul className="mt-3 space-y-2">
              {component.dependencies?.map(dep => (
                <li key={dep} className="flex items-center gap-4 ml-4">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link href={`/component/${encodeURIComponent(dep)}`} className="text-base font-medium text-foreground hover:underline">
                    {dep}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No component dependencies were identified.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
