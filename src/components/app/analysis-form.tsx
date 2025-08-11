
'use client';

import React, { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeRepositoryAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Terminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentCatalog } from './component-catalog';
import { SystemMap } from './system-map';
import type { AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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
  const [selectedRepo, setSelectedRepo] = useState<string>(repositories[0] || '');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');
  const [fileCount, setFileCount] = useState<string>('all');


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
        <CardHeader>
            <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
            <form action={formAction} className="space-y-4">
            <div className='space-y-2'>
                <Label htmlFor="repository">Repository</Label>
                <Select name="repository" required value={selectedRepo} onValueChange={setSelectedRepo}>
                    <SelectTrigger id="repository" className="w-full h-11 text-base">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='space-y-2'>
                    <Label htmlFor="model">AI Model</Label>
                    <Select name="model" required value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger id="model" className="w-full h-11 text-base">
                        <SelectValue placeholder="Select a model..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                        <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div className='space-y-2'>
                    <Label htmlFor="apiKey">Google AI API Key (Optional)</Label>
                    <Input id="apiKey" name="apiKey" type="password" placeholder="Enter your API Key" className="h-11 text-base" />
                </div>
            </div>

            <div className='space-y-2'>
                <Label htmlFor="fileCount">Files to process</Label>
                <Select name="fileCount" required value={fileCount} onValueChange={setFileCount}>
                <SelectTrigger id="fileCount" className="w-full h-11 text-base">
                    <SelectValue placeholder="Select number of files..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                </SelectContent>
                </Select>
            </div>
            
            <p className="text-xs text-muted-foreground pt-2">
                Your API key is sent with each request and not stored. If left blank, the server's environment variable will be used.
            </p>

            <div className="pt-2">
                <SubmitButton />
            </div>
            </form>
        </CardContent>
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
