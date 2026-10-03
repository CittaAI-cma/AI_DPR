// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Contrast, Languages } from 'lucide-react';
import { useLandingCopy } from '@/i18n/landingCopy';

/*
 * Accessibility utility bar (GIGW 3.0 / WCAG 2.1 conventions):
 *  - "Skip to main content" link (jumps to #main)
 *  - Text size controls: decrease / reset / increase (scales the whole page,
 *    since sizes are rem-based)
 *  - High-contrast mode toggle
 *  - Language switch (English / Telugu)
 * Preferences are remembered in this browser; the page works normally if
 * storage is unavailable.
 */

const KEY = 'a11y-prefs';
const SIZES = [87.5, 100, 112.5, 125]; // % of the browser's default font size
const DEFAULT_STEP = 1;

type Prefs = { step: number; contrast: boolean };

const read = (): Prefs => {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || '{}');
    return {
      step: Number.isInteger(p.step) && p.step >= 0 && p.step < SIZES.length ? p.step : DEFAULT_STEP,
      contrast: !!p.contrast,
    };
  } catch {
    return { step: DEFAULT_STEP, contrast: false };
  }
};

const apply = ({ step, contrast }: Prefs) => {
  const root = document.documentElement;
  root.style.fontSize = step === DEFAULT_STEP ? '' : `${SIZES[step]}%`;
  root.classList.toggle('a11y-hc', contrast);
};

const btn =
  'inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded px-1.5 font-semibold leading-none transition-colors hover:bg-white/15 aria-pressed:bg-white aria-pressed:text-[#1e4341] disabled:cursor-not-allowed disabled:opacity-40';

export const AccessibilityBar: React.FC = () => {
  const [prefs, setPrefs] = useState<Prefs>(() => (typeof window === 'undefined' ? { step: DEFAULT_STEP, contrast: false } : read()));

  useEffect(() => {
    apply(prefs);
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* storage unavailable: preference lasts for this page view only */
    }
    return () => {
      document.documentElement.style.fontSize = '';
      document.documentElement.classList.remove('a11y-hc');
    };
  }, [prefs]);

  const { c, lang, setLang } = useLandingCopy();
  const t = c.a11y;

  const setStep = (step: number) => setPrefs((p) => ({ ...p, step: Math.max(0, Math.min(SIZES.length - 1, step)) }));

  return (
    <div className="on-dark bg-[#1e4341] text-[13px] text-white" role="region" aria-label={t.region}>
      <div className="page-container flex min-h-[36px] flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1">
        <a
          href="#main"
          onClick={(e) => {
            const main = document.getElementById('main');
            if (main) {
              e.preventDefault();
              main.setAttribute('tabindex', '-1');
              main.focus({ preventScroll: true });
              main.scrollIntoView({ block: 'start' });
            }
          }}
          className="rounded px-1 py-1 font-medium underline-offset-4 hover:underline"
        >
          {t.skip}
        </a>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex items-center gap-1" role="group" aria-label={t.textSize}>
            <span className="mr-1 hidden text-white/80 sm:inline" aria-hidden="true">
              {t.textSize}
            </span>
            <button type="button" className={btn} onClick={() => setStep(prefs.step - 1)} disabled={prefs.step === 0} aria-label={t.decrease}>
              A<span aria-hidden="true">−</span>
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => setStep(DEFAULT_STEP)}
              aria-pressed={prefs.step === DEFAULT_STEP}
              aria-label={t.reset}
            >
              A
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => setStep(prefs.step + 1)}
              disabled={prefs.step === SIZES.length - 1}
              aria-label={t.increase}
            >
              A<span aria-hidden="true">+</span>
            </button>
          </div>

          <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden="true" />

          <button
            type="button"
            className={`${btn} gap-1.5 px-2 font-medium`}
            onClick={() => setPrefs((p) => ({ ...p, contrast: !p.contrast }))}
            aria-pressed={prefs.contrast}
          >
            <Contrast className="h-3.5 w-3.5" aria-hidden="true" />
            {t.contrast}
          </button>

          <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden="true" />

          <div className="flex items-center gap-1" role="group" aria-label={t.language}>
            <Languages className="mr-0.5 h-3.5 w-3.5 text-white/80" aria-hidden="true" />
            <button type="button" lang="en" className={`${btn} px-2 font-medium`} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>
              English
            </button>
            <button type="button" lang="te" className={`${btn} px-2 font-medium`} onClick={() => setLang('te')} aria-pressed={lang === 'te'}>
              తెలుగు
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
