import React from 'react';
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
  /** “Need help choosing?” — shown above the question on mobile, beside Option A on sm+. */
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

  return (
    <div className="w-full max-w-2xl mx-auto">
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
              <div
                key={optionId}
                className={cn('flex items-center gap-2', isOptionA && helpTrigger && 'sm:gap-3')}
              >
                <button
                  type="button"
                  onClick={() => onSelect(optionId)}
                  className={cn(
                    'flex-1 min-w-0 text-left rounded-[12px] border-2 px-4 py-4 transition-colors',
                    active
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border hover:border-primary/50 hover:bg-muted/60'
                  )}
                >
                  <span className="font-semibold text-primary mr-2">{letter}.</span>
                  {t(`ventureMatch.questions.${question.id}.options.${optionId}`)}
                </button>
                {isOptionA && helpTrigger && (
                  <div className="hidden sm:flex shrink-0 self-center">{helpTrigger}</div>
                )}
              </div>
            );
          })}
        </div>
        {question.multi && (
          <Button className="w-full mt-6" disabled={!canContinue} onClick={onContinue}>
            {t('common.next')}
          </Button>
        )}
      </div>
    </div>
  );
};
