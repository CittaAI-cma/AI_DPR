import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionDef } from '@/lib/ventureMatch/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface VentureMatchCardProps {
  question: QuestionDef;
  index: number;
  total: number;
  selected: string | string[] | undefined;
  remaining: number;
  onSelect: (optionId: string) => void;
  onContinue?: () => void;
  /** “Need help choosing?” — above the question on mobile; outside the card beside Option A on sm+. */
  helpTrigger?: React.ReactNode;
}

export const VentureMatchCard: React.FC<VentureMatchCardProps> = ({
  question,
  index,
  total,
  selected,
  remaining,
  onSelect,
  onContinue,
  helpTrigger,
}) => {
  const { t } = useTranslation();
  const selectedSet = new Set(Array.isArray(selected) ? selected : selected ? [selected] : []);
  const canContinue = question.multi && selectedSet.size > 0;

  const wrapRef = useRef<HTMLDivElement>(null);
  const optionARef = useRef<HTMLButtonElement>(null);
  const [helpPos, setHelpPos] = useState<{ top: number; height: number } | null>(null);

  useLayoutEffect(() => {
    if (!helpTrigger) {
      setHelpPos(null);
      return;
    }

    const update = () => {
      const wrap = wrapRef.current;
      const optionA = optionARef.current;
      if (!wrap || !optionA) return;
      const wrapRect = wrap.getBoundingClientRect();
      const optionRect = optionA.getBoundingClientRect();
      setHelpPos({
        top: optionRect.top - wrapRect.top,
        height: optionRect.height,
      });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [helpTrigger, question.id, question.multi, t]);

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <span>{t('ventureMatch.progress', { current: index + 1, total })}</span>
          <span>{t('ventureMatch.remaining', { count: remaining })}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted mb-8 overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card is full max-w-2xl; help pill sits outside the card to the right of Option A. */}
      <div ref={wrapRef} className="relative max-w-2xl mx-auto">
        <div className="rounded-[18px] border-2 border-primary/20 bg-card shadow-lg p-6 sm:p-8">
          {helpTrigger && <div className="mb-4 sm:hidden">{helpTrigger}</div>}

          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
            {t(`ventureMatch.questions.${question.id}.label`)}
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {t(`ventureMatch.questions.${question.id}.title`)}
          </h2>
          {question.multi && (
            <p className="text-sm text-muted-foreground mb-4">{t('ventureMatch.selectAll')}</p>
          )}

          <div className="space-y-3">
            {question.optionIds.map((optionId, optionIndex) => {
              const active = selectedSet.has(optionId);
              const letter = String.fromCharCode(65 + optionIndex);
              const isOptionA = optionIndex === 0;
              return (
                <button
                  key={optionId}
                  ref={isOptionA ? optionARef : undefined}
                  type="button"
                  onClick={() => onSelect(optionId)}
                  className={cn(
                    'w-full text-left rounded-[12px] border-2 px-4 py-4 transition-colors',
                    active
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border hover:border-primary/50 hover:bg-muted/60'
                  )}
                >
                  <span className="font-semibold text-primary mr-2">{letter}.</span>
                  {t(`ventureMatch.questions.${question.id}.options.${optionId}`)}
                </button>
              );
            })}
          </div>

          {question.multi && (
            <Button className="w-full mt-6" disabled={!canContinue} onClick={onContinue}>
              {t('common.next')}
            </Button>
          )}
        </div>

        {helpTrigger && helpPos && (
          <div
            className="pointer-events-auto absolute left-full top-0 ml-3 hidden sm:flex items-center"
            style={{ top: helpPos.top, height: helpPos.height }}
          >
            {helpTrigger}
          </div>
        )}
      </div>
    </div>
  );
};
