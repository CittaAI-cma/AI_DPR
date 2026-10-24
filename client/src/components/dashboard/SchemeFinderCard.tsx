import React, { useState } from 'react';
import { Search, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useClusterFormText } from '@/lib/clusterDprFormText';

interface SchemeFinderCardProps {
  /** Opens the scheme list with the words already typed into its search box. */
  onSearch: (words: string) => void;
  onViewAll: () => void;
}

export const SchemeFinderCard: React.FC<SchemeFinderCardProps> = ({ onSearch, onViewAll }) => {
  const tf = useClusterFormText();
  const [words, setWords] = useState('');
  const sectors = [tf('Food Processing'), tf('Manufacturing'), tf('Services')];
  return (
    <section data-tour="finder" aria-labelledby="finder-title" className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-destructive/10 text-destructive-text" aria-hidden="true"><Target className="h-5 w-5" /></span>
        <div className="min-w-0">
          <h2 id="finder-title" className="text-base font-semibold text-foreground">{tf('Scheme Finder')}</h2>
          <p className="text-sm text-muted-foreground">{tf('Find government schemes for your business')}</p>
        </div>
      </header>
      <form
        className="mt-3 flex gap-2"
        role="search"
        onSubmit={(event) => { event.preventDefault(); onSearch(words.trim()); }}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={words}
            maxLength={80}
            onChange={(event) => setWords(event.target.value)}
            aria-label={tf('Search schemes by sector, keyword...')}
            placeholder={tf('Search schemes by sector, keyword...')}
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          />
        </div>
        <Button type="submit" variant="primary" size="sm" className="h-10 flex-none px-4">{tf('Search')}</Button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{tf('Popular sectors:')}</span>
        {sectors.map((sector) => (
          <button
            key={sector}
            type="button"
            onClick={() => onSearch(sector)}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          >
            {sector}
          </button>
        ))}
        <button type="button" onClick={onViewAll} className="ml-auto inline-flex items-center gap-1 rounded text-xs font-medium text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring">
          {tf('View all')} <Sparkles className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
