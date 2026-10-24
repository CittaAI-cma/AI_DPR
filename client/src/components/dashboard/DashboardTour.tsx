import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useClusterFormText } from '@/lib/clusterDprFormText';

interface DashboardTourProps {
  open: boolean;
  onClose: () => void;
}

/** One stop on the tour: the part of the page it points at (matched by data-tour) and what to say about it. */
const STOPS = [
  { target: 'actions', title: 'Start here', text: 'Create DPR starts a new report. Scheme Finder helps you find government schemes that fit your business.' },
  { target: 'journey', title: 'The four steps of a DPR', text: 'Create, fill in details, let AI check the quality, then generate the report. Each step opens the place where it happens.' },
  { target: 'summary', title: 'Your numbers at a glance', text: 'These cards count your reports by status. Press one to see just those reports.' },
  { target: 'recent', title: 'Pick up where you left off', text: 'Your latest reports are listed here. Open, edit or delete one, or press View All DPRs for the full list.' },
  { target: 'finder', title: 'Find a scheme', text: 'Type a sector or keyword to see matching schemes, or press a popular sector.' },
  { target: 'quick', title: 'Shortcuts', text: 'Common tasks in one row: create a DPR, read the guide, find schemes or open your projects.' },
] as const;

/**
 * A short, skippable walk through the dashboard. It highlights one part of the page at a time (an outline set from index.css),
 * scrolls it into view and explains it in a small panel. Escape or Close ends it; focus returns to the button that started it.
 */
export const DashboardTour: React.FC<DashboardTourProps> = ({ open, onClose }) => {
  const tf = useClusterFormText();
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const clearMark = () => document.querySelectorAll('[data-tour-active]').forEach((el) => el.removeAttribute('data-tour-active'));

  useEffect(() => {
    if (!open) return undefined;
    opener.current = document.activeElement;
    setIndex(0);
    return () => {
      clearMark();
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    clearMark();
    const target = document.querySelector(`[data-tour="${STOPS[index].target}"]`);
    if (target) {
      target.setAttribute('data-tour-active', 'true');
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' });
    }
    panelRef.current?.querySelector<HTMLElement>('[data-tour-next]')?.focus();
  }, [open, index]);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
    if (event.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, STOPS.length - 1));
    if (event.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
  }, [onClose]);

  if (!open) return null;
  const stop = STOPS[index];
  const last = index === STOPS.length - 1;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="tour-title"
      aria-describedby="tour-text"
      onKeyDown={onKeyDown}
      className="no-print fixed inset-x-3 bottom-4 z-[300] mx-auto w-auto max-w-md rounded-2xl border border-border bg-card p-4 shadow-xl sm:left-auto sm:right-6 sm:mx-0"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true"><Compass className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground" role="status">{tf('Tour')} · {index + 1} / {STOPS.length}</p>
          <h2 id="tour-title" className="text-base font-semibold text-foreground">{tf(stop.title)}</h2>
          <p id="tour-text" className="mt-1 text-sm leading-relaxed text-muted-foreground">{tf(stop.text)}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={tf('Close tour')}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {tf('Back')}
        </Button>
        <Button variant="primary" size="sm" data-tour-next onClick={() => (last ? onClose() : setIndex((i) => i + 1))} className="gap-1.5">
          {last ? tf('Done') : tf('Next')} {!last && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
};
