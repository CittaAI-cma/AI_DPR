import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Keeps a pop-up mounted for a moment after it is closed so it can fade out, and says when it is closing.
 * `render` is what to use for "draw the pop-up"; `closing` adds the exit animation class.
 */
export function useDialogPresence(open: boolean, exitMs = 160): { render: boolean; closing: boolean } {
  const [render, setRender] = useState(open);
  useEffect(() => {
    if (open) {
      setRender(true);
      return undefined;
    }
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setRender(false), reduced ? 0 : exitMs);
    return () => window.clearTimeout(timer);
  }, [open, exitMs]);
  return { render: open || render, closing: !open && render };
}

/**
 * While a pop-up is open: the page behind it stops scrolling, focus moves into the pop-up, and focus goes back to
 * whatever opened it when the pop-up closes.
 */
export function useDialogFocus(open: boolean, dialogRef: RefObject<HTMLElement | null>): void {
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return undefined;
    opener.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => {
      const node = dialogRef.current;
      if (node && !node.contains(document.activeElement)) {
        if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
        node.focus({ preventScroll: true });
      }
    });
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      const back = opener.current;
      // After the click that closed the pop-up has finished moving focus (a click outside would otherwise win).
      window.setTimeout(() => {
        if (back && document.contains(back)) back.focus({ preventScroll: true });
      }, 0);
    };
  }, [open, dialogRef]);
}
