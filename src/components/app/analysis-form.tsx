'use client';

import React, { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { analyzeRepositoryAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Terminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentCatalog } from './component-catalog';
import { SystemMap } from './system-map';
import type { AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';
import { Card } from '../ui/card';

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

export function AnalysisForm() {
  const [state, formAction] = useFormState(analyzeRepositoryAction, initialState);
  const [result, setResult] = useState<AnalyzeRepositoryOutput | undefined>();

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
          <Textarea
            name="repositoryContents"
            placeholder="Paste your repository contents here... The more complete the code, the better the analysis."
            className="min-h-[250px] bg-background font-code text-sm"
            required
          />
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
