'use client';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AnalyzeRepositoryOutput } from '@/ai/flows/analyze-repository';
import { ComponentCard } from './component-card';

type Component = AnalyzeRepositoryOutput['components'][0];

interface ComponentCatalogProps {
  components: Component[];
}

export function ComponentCatalog({ components }: ComponentCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const componentTypes = useMemo(() => ['all', ...Array.from(new Set(components.map(c => c.type)))], [components]);

  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const searchCorpus = `${component.name} ${component.description} ${component.language}`.toLowerCase();
      const matchesSearch = searchCorpus.includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || component.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [components, searchTerm, filterType]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input 
          placeholder="Search components by name, description, language..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {componentTypes.map(type => (
              <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map(component => (
          <ComponentCard key={component.name} component={component} />
        ))}
      </div>
       {filteredComponents.length === 0 && (
        <div className="text-center text-muted-foreground col-span-full py-10">
          <p>No components match your criteria.</p>
        </div>
      )}
    </div>
  );
}
