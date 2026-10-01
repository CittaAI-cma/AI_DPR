import React, { useMemo, useState } from 'react';
import { Building2, Landmark, ChevronRight, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SCHEME_OPTIONS } from '@/lib/individualDpr/schemeFormConfig';
import {
  briefLangFromI18n,
  getSchemeBrief,
  loc,
} from '@/lib/individualDpr/schemeBriefs';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SchemePickerGridProps {
  onSelect: (schemeCode: string | null) => void;
}

type LevelFilter = 'all' | 'central' | 'state' | 'bank';
type KindFilter = 'all' | 'subsidy' | 'loan' | 'guarantee' | 'other';

function schemeLevel(typeEn: string): Exclude<LevelFilter, 'all'> {
  if (typeEn === 'Central Scheme') return 'central';
  if (typeEn === 'State Scheme') return 'state';
  return 'bank';
}

function schemeKind(categoryEn: string): Exclude<KindFilter, 'all'> {
  const text = categoryEn.toLowerCase();
  if (text.includes('guarantee')) return 'guarantee';
  if (
    text.includes('subsidy') ||
    text.includes('subvention') ||
    text.includes('rebate') ||
    text.includes('incentive')
  ) {
    return 'subsidy';
  }
  if (text.includes('loan') || text.includes('refinance') || text.includes('toolkit')) return 'loan';
  return 'other';
}

const selectClass =
  'h-12 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

export const SchemePickerGrid: React.FC<SchemePickerGridProps> = ({ onSelect }) => {
  const { t, i18n } = useTranslation();
  const tf = useClusterFormText();
  const lang = briefLangFromI18n(i18n.language);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<LevelFilter>('all');
  const [kind, setKind] = useState<KindFilter>('all');

  const cards = useMemo(
    () =>
      SCHEME_OPTIONS.map((opt) => {
        const code = opt.code || null;
        const brief = getSchemeBrief(code);
        const categoryEn = brief.quickInfo.category.en;
        const typeEn = brief.quickInfo.type.en;
        const haystack = [
          brief.title.en,
          brief.title.te,
          brief.intro.en,
          brief.intro.te,
          brief.quickInfo.ministry.en,
          brief.quickInfo.ministry.te,
          categoryEn,
          brief.quickInfo.category.te,
          typeEn,
          brief.quickInfo.type.te,
          code || '',
        ]
          .join(' ')
          .toLowerCase();
        return {
          code,
          title: loc(brief.title, lang),
          intro: loc(brief.intro, lang),
          ministry: loc(brief.quickInfo.ministry, lang),
          category: loc(brief.quickInfo.category, lang),
          type: loc(brief.quickInfo.type, lang),
          isVanilla: !code,
          level: schemeLevel(typeEn),
          kind: schemeKind(categoryEn),
          haystack,
        };
      }),
    [lang]
  );

  const filtered = cards.filter((card) => {
    if (level !== 'all' && card.level !== level) return false;
    if (kind !== 'all' && card.kind !== kind) return false;
    const q = query.trim().toLowerCase();
    if (q && !card.haystack.includes(q)) return false;
    return true;
  });

  const filtersActive = query.trim() !== '' || level !== 'all' || kind !== 'all';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 max-w-2xl">
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

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tf('Search by name, ministry, or support')}
            aria-label={tf('Search schemes')}
            className="h-12 pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className={selectClass}
            value={level}
            onChange={(e) => setLevel(e.target.value as LevelFilter)}
            aria-label={tf('All levels')}
          >
            <option value="all">{tf('All levels')}</option>
            <option value="central">{tf('Central schemes')}</option>
            <option value="state">{tf('Andhra Pradesh schemes')}</option>
            <option value="bank">{tf('Bank term loan')}</option>
          </select>
          <select
            className={selectClass}
            value={kind}
            onChange={(e) => setKind(e.target.value as KindFilter)}
            aria-label={tf('All kinds')}
          >
            <option value="all">{tf('All kinds')}</option>
            <option value="subsidy">{tf('Subsidy')}</option>
            <option value="loan">{tf('Loan')}</option>
            <option value="guarantee">{tf('Guarantee')}</option>
            <option value="other">{tf('Other support')}</option>
          </select>
          {filtersActive && (
            <Button
              type="button"
              variant="outline"
              className="h-12"
              onClick={() => {
                setQuery('');
                setLevel('all');
                setKind('all');
              }}
            >
              <X className="h-4 w-4 mr-1" />
              {tf('Clear')}
            </Button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {filtered.length} {tf('schemes')}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          {tf('No schemes match this search.')}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((card) => (
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
      )}
    </div>
  );
};
