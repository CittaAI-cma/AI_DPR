import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowBigDown, ArrowBigUp, ArrowLeft, ArrowRight, Compass, FlaskConical, LogOut, MousePointerClick } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useTourStore } from '@/store/tourStore';
import { TOUR_STOPS } from '@/lib/tourSteps';
import { applySampleToStore } from '@/lib/individualDpr/sampleData/apply';
import { useClusterFormText } from '@/lib/clusterDprFormText';

const ARROW = 44;
const PANEL_W = 384;
const GAP = 16;
/** Events that would act on the page. While the tour runs they are stopped unless they hit the tour panel or the one button to press. */
const BLOCKED = ['click', 'dblclick', 'auxclick', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend', 'contextmenu', 'submit'] as const;

/** The first element for the selector that is actually on screen (the page can hold hidden copies, such as a toolbar for small screens). */
function findVisible(selector: string): HTMLElement | null {
  for (const node of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
    const box = node.getBoundingClientRect();
    if (node.getClientRects().length > 0 && box.width > 0 && box.height > 0) return node;
  }
  return null;
}

/**
 * The guided tour. It follows the person across pages: a bouncing arrow points at the real button to press, an outline marks
 * what is being explained, and a panel says what it is. The tour moves on when the highlighted button is pressed.
 * "Exit tour" is always there; the dashboard's "Take a Tour" button starts it again from the beginning.
 */
export const ProductTour: React.FC = () => {
  const tf = useClusterFormText();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const signedIn = useAuthStore((s) => s.isAuthenticated);
  const { active, step, stop, goTo } = useTourStore();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [box, setBox] = useState<DOMRect | null>(null);
  const [filling, setFilling] = useState(false);
  const scrolledFor = useRef('');
  const targetRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const last = TOUR_STOPS.length - 1;
  const stop_ = TOUR_STOPS[Math.min(step, last)];
  const onRoute = stop_.route.test(pathname);

  const clearMarks = () => document.querySelectorAll('[data-tour-active]').forEach((el) => el.removeAttribute('data-tour-active'));
  const advance = useCallback(() => {
    if (useTourStore.getState().step >= last) {
      stop();
      navigate('/dashboard'); // the tour ends where it began
    } else {
      goTo(useTourStore.getState().step + 1);
    }
  }, [goTo, last, navigate, stop]);

  // Leaving the app ends the tour.
  useEffect(() => {
    if (active && !signedIn) stop();
  }, [active, signedIn, stop]);

  // Keep looking for the target (pages draw it a moment after a click) and follow it as the page moves.
  useEffect(() => {
    if (!active || !onRoute) { setTarget(null); setBox(null); clearMarks(); return undefined; }
    const tick = () => {
      const found = stop_.target ? findVisible(stop_.target) : null;
      if (found !== targetRef.current) {
        clearMarks();
        targetRef.current = found;
        setTarget(found);
        if (found) found.setAttribute('data-tour-active', stop_.kind === 'click' ? 'click' : 'info');
      }
      setBox(found ? found.getBoundingClientRect() : null);
      if (found && scrolledFor.current !== stop_.id) {
        scrolledFor.current = stop_.id;
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const r = found.getBoundingClientRect();
        const big = r.height > window.innerHeight * 0.6;
        found.scrollIntoView({ block: big ? 'start' : 'center', behavior: calm ? 'auto' : 'smooth' });
      }
    };
    tick();
    const timer = window.setInterval(tick, 250);
    window.addEventListener('resize', tick);
    window.addEventListener('scroll', tick, true);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('resize', tick);
      window.removeEventListener('scroll', tick, true);
      clearMarks();
      targetRef.current = null;
    };
  }, [active, onRoute, stop_]);

  // While the tour runs only two things work: the tour panel and, on a "click" step, the one highlighted button. Everything else is off.
  useEffect(() => {
    if (!active) return undefined;
    const allowed = (node: EventTarget | null) =>
      node instanceof Node &&
      (Boolean(panelRef.current?.contains(node)) ||
        (stop_.kind === 'click' && Boolean(targetRef.current?.contains(node))) ||
        (node instanceof Element && Boolean(node.closest('[role="alertdialog"]')))); // the "still there?" session warning must keep working
    const block = (event: Event) => {
      if (allowed(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const blockKey = (event: KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') && !allowed(event.target)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    BLOCKED.forEach((name) => document.addEventListener(name, block, true));
    document.addEventListener('keydown', blockKey, true);
    return () => {
      BLOCKED.forEach((name) => document.removeEventListener(name, block, true));
      document.removeEventListener('keydown', blockKey, true);
    };
  }, [active, stop_]);

  // A "click" step finishes when the person presses the highlighted button.
  useEffect(() => {
    if (!active || !onRoute || stop_.kind !== 'click') return undefined;
    const onClick = (event: MouseEvent) => {
      const el = targetRef.current;
      if (el && event.target instanceof Node && el.contains(event.target)) window.setTimeout(advance, 150);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [active, onRoute, stop_, advance]);

  if (!active || !signedIn) return null;

  const fillSample = async () => {
    setFilling(true);
    try {
      if (await applySampleToStore()) {
        toast.success(tf('Sample answers filled in. You can change any of them.'));
        advance();
      } else {
        toast.error(tf('There are no sample answers for this scheme yet.'));
      }
    } catch {
      toast.error(tf('Could not fill in the sample answers.'));
    } finally {
      setFilling(false);
    }
  };

  // The panel sits next to what it explains (below it, or above it when there is no room), with the arrow on the other side.
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const narrow = vw < 640;
  const panelW = narrow ? vw - 24 : PANEL_W;
  const panelH = panelRef.current?.offsetHeight || 230;
  let arrow: { left: number; top: number; up: boolean } | null = null;
  let panelPos: React.CSSProperties = { right: narrow ? 12 : 24, bottom: 16, width: panelW };
  if (box && onRoute && stop_.target) {
    const big = box.height > vh * 0.6;
    const left = Math.min(Math.max(box.left + Math.min(box.width, vw) / 2 - ARROW / 2, 8), vw - ARROW - 8);
    const panelLeft = narrow ? 12 : Math.min(Math.max(box.left + Math.min(box.width, vw) / 2 - panelW / 2, 12), vw - panelW - 12);
    const below = vh - box.bottom;
    if (big) {
      arrow = { left: Math.min(Math.max(box.left + 28, 8), vw - ARROW - 8), top: Math.max(box.top, 76) + 8, up: false };
    } else if (below >= panelH + ARROW + GAP + 8) {
      arrow = { left, top: Math.max(box.top - ARROW - 6, 4), up: false };
      panelPos = { left: panelLeft, top: box.bottom + GAP, width: panelW };
    } else if (box.top >= panelH + ARROW + GAP + 8) {
      arrow = { left, top: box.bottom + 6, up: true };
      panelPos = { left: panelLeft, top: box.top - panelH - GAP, width: panelW };
    } else {
      arrow = { left, top: Math.max(box.top - ARROW - 6, 4), up: false };
    }
  }
  const isClick = stop_.kind === 'click';
  const waiting = onRoute && Boolean(stop_.target) && !target;

  return (
    <>
      {box && target && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[298] rounded-xl shadow-[0_0_0_9999px_rgba(15,23,42,0.5)]"
          style={{ left: box.left - 6, top: box.top - 6, width: box.width + 12, height: box.height + 12 }}
        />
      )}
      {arrow && isClick && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[299] inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground shadow-lg"
          style={{ left: Math.min(arrow.left + ARROW + 4, vw - 130), top: arrow.top + (arrow.up ? 10 : 8) }}
        >
          <MousePointerClick className="h-3.5 w-3.5" /> {tf('Click here')}
        </div>
      )}
      {arrow && (
        <div
          aria-hidden="true"
          className={`tour-arrow pointer-events-none fixed z-[299] text-primary drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] ${arrow.up ? 'tour-arrow-up' : ''}`}
          style={{ left: arrow.left, top: arrow.top, width: ARROW, height: ARROW }}
        >
          {arrow.up ? <ArrowBigUp className="h-full w-full fill-current" strokeWidth={1.5} /> : <ArrowBigDown className="h-full w-full fill-current" strokeWidth={1.5} />}
        </div>
      )}
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="tour-title"
        aria-describedby="tour-text"
        ref={panelRef}
        style={panelPos}
        className="no-print fixed z-[300] rounded-2xl border border-border bg-card p-4 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true"><Compass className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground" role="status">{tf('Tour')} · {Math.min(step, last) + 1} / {TOUR_STOPS.length}</p>
            <h2 id="tour-title" className="text-base font-semibold text-foreground">{tf(stop_.title)}</h2>
            {onRoute ? (
              <p id="tour-text" className="mt-1 text-sm leading-relaxed text-muted-foreground">{tf(stop_.text)}</p>
            ) : (
              <p id="tour-text" className="mt-1 text-sm leading-relaxed text-muted-foreground">{tf('This step is on another page.')}</p>
            )}
            {isClick && onRoute && stop_.press && (
              <p className="mt-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-foreground">
                {tf('Your turn: press')} <strong>{tf(stop_.press)}</strong>
              </p>
            )}
            {waiting && <p className="mt-2 text-xs text-muted-foreground" role="status">{tf('Waiting for the page…')}</p>}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <Button variant="outline" size="sm" onClick={stop} className="gap-1.5 border-destructive/40 text-destructive-text hover:bg-destructive/10">
            <LogOut className="h-4 w-4" aria-hidden="true" /> {tf('Exit tour')}
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={() => goTo(step - 1)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {tf('Back')}
              </Button>
            )}
            {!onRoute && (
              <Button variant="primary" size="sm" onClick={() => navigate(stop_.go)}>{tf('Take me there')}</Button>
            )}
            {onRoute && stop_.kind === 'action' && (
              <Button variant="primary" size="sm" onClick={() => void fillSample()} isLoading={filling} className="gap-1.5">
                <FlaskConical className="h-4 w-4" aria-hidden="true" /> {tf('Fill sample answers')}
              </Button>
            )}
            {onRoute && (stop_.kind === 'info' || stop_.kind === 'action' || waiting || isClick) && (
              <Button variant={stop_.kind === 'info' ? 'primary' : 'outline'} size="sm" onClick={advance} className="gap-1.5">
                {step >= last ? tf('Finish') : isClick ? tf('Skip this step') : stop_.kind === 'action' ? tf('Skip') : tf('Next')}
                {step < last && stop_.kind === 'info' && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
