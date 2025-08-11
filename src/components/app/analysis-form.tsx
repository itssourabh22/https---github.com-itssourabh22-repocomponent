'use client';

import React, { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeRepositoryAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Terminal, FolderGit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentCatalog } from './component-catalog';
import { SystemMap } from './system-map';
import type { AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const initialState = {
  message: '',
  result: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Analyzing...' : 'Analyze Repository'}
    </Button>
  );
}

interface AnalysisFormProps {
    repositories: string[];
}

export function AnalysisForm({ repositories }: AnalysisFormProps) {
  const [state, formAction] = useActionState(analyzeRepositoryAction, initialState);
  const [result, setResult] = useState<AnalyzeRepositoryOutput | undefined>();
  const [selectedRepo, setSelectedRepo] = useState<string>('');

  useEffect(() => {
    if (state.result) {
      setResult(state.result);
      try {
        sessionStorage.setItem('analysisResult', JSON.stringify(state.result));
      } catch (e) {
        console.error("Could not save to session storage", e);
      }
    }
  }, [state.result]);
  
  return (
    <div className="space-y-8">
      <Card>
        <form action={formAction} className="space-y-4 p-6">
           <Select name="repository" required value={selectedRepo} onValueChange={setSelectedRepo}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Select a repository to analyze..." />
              </SelectTrigger>
              <SelectContent>
                {repositories.length > 0 ? (
                    repositories.map(repo => (
                        <SelectItem key={repo} value={repo}>{repo}</SelectItem>
                    ))
                ) : (
                    <div className="p-4 text-sm text-muted-foreground">No repositories found. Add a project folder to `public/repo` to get started.</div>
                )}
              </SelectContent>
            </Select>
          <SubmitButton />
        </form>
      </Card>

      {state.error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>{state.error}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {result && result.components.length > 0 && (
        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="catalog">Component Catalog</TabsTrigger>
            <TabsTrigger value="map">System Map</TabsTrigger>
          </TabsList>
          <TabsContent value="catalog" className="mt-6">
            <ComponentCatalog components={result.components} />
          </TabsContent>
          <TabsContent value="map" className="mt-6">
            <SystemMap components={result.components} />
          </TabsContent>
        </Tabs>
      )}

      {state.result && state.result.components.length === 0 && (
         <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No Components Found</AlertTitle>
          <AlertDescription>The analysis completed, but no components were identified in the provided text.</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
