import React, { useMemo } from 'react';
import { Building2, Landmark, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SCHEME_OPTIONS } from '@/lib/individualDpr/schemeFormConfig';
import {
  briefLangFromI18n,
  getSchemeBrief,
  loc,
} from '@/lib/individualDpr/schemeBriefs';

interface SchemePickerGridProps {
  onSelect: (schemeCode: string | null) => void;
}

export const SchemePickerGrid: React.FC<SchemePickerGridProps> = ({ onSelect }) => {
  const { t, i18n } = useTranslation();
  const lang = briefLangFromI18n(i18n.language);

  const cards = useMemo(
    () =>
      SCHEME_OPTIONS.map((opt) => {
        const code = opt.code || null;
        const brief = getSchemeBrief(code);
        return {
          code,
          title: loc(brief.title, lang),
          intro: loc(brief.intro, lang),
          ministry: loc(brief.quickInfo.ministry, lang),
          category: loc(brief.quickInfo.category, lang),
          type: loc(brief.quickInfo.type, lang),
          isVanilla: !code,
        };
      }),
    [lang]
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          {t('individualDpr.picker.title', { defaultValue: 'Choose how to draft this DPR' })}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t('individualDpr.picker.subtitle', {
            defaultValue:
              'Pick a scheme to overlay subsidy rules and documents, or continue with a plain bank term loan.',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => (
          <button
            key={card.code || 'vanilla'}
            type="button"
            onClick={() => onSelect(card.code)}
            className="group text-left rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  card.isVanilla ? 'bg-secondary/15 text-secondary' : 'bg-primary/10 text-primary'
                }`}
              >
                {card.isVanilla ? <Landmark className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-1" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-foreground leading-snug line-clamp-2">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-5 line-clamp-3">{card.intro}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {card.category}
              </span>
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {card.type}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground line-clamp-1">{card.ministry}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
