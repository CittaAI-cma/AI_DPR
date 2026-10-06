import React, { useMemo, useState } from 'react';
import {
  BadgePercent,
  Banknote,
  Building2,
  ChevronRight,
  Landmark,
  Layers,
  LayoutGrid,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SCHEME_OPTIONS } from '@/lib/individualDpr/schemeFormConfig';
import {
  briefLangFromI18n,
  getSchemeBrief,
  loc,
} from '@/lib/individualDpr/schemeBriefs';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import { cardMatchesFilters, schemeKind, schemeLevel, type SchemeKind, type SchemeLevel } from '@/lib/schemePickerFilters';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SchemePickerGridProps {
  onSelect: (schemeCode: string | null) => void;
}

const LEVELS: Array<{ id: SchemeLevel; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'central', label: 'Central schemes', icon: Landmark },
  { id: 'state', label: 'Andhra Pradesh schemes', icon: MapPinned },
  { id: 'bank', label: 'Bank term loan', icon: Banknote },
];

const KINDS: Array<{ id: SchemeKind; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'subsidy', label: 'Subsidy', icon: BadgePercent },
  { id: 'loan', label: 'Loan', icon: Wallet },
  { id: 'guarantee', label: 'Guarantee', icon: ShieldCheck },
  { id: 'other', label: 'Other support', icon: Sparkles },
];

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterTile({
  on,
  label,
  icon: Icon,
  onClick,
}: {
  on: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex h-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
        on
          ? 'border-primary bg-primary/10 text-primary shadow-sm'
          : 'border-border bg-background text-foreground hover:border-primary/30 hover:bg-muted/50'
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          on ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="text-sm font-medium leading-snug">{label}</span>
    </button>
  );
}

export const SchemePickerGrid: React.FC<SchemePickerGridProps> = ({ onSelect }) => {
  const { t, i18n } = useTranslation();
  const tf = useClusterFormText();
  const lang = briefLangFromI18n(i18n.language);
  const [query, setQuery] = useState('');
  const [levels, setLevels] = useState<SchemeLevel[]>([]);
  const [kinds, setKinds] = useState<SchemeKind[]>([]);

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

  const filtered = cards.filter((card) => cardMatchesFilters(card, levels, kinds, query));

  const filtersActive = query.trim() !== '' || levels.length > 0 || kinds.length > 0;

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

      <div className="mb-5 space-y-4">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tf('Search by name, ministry, or support')}
            aria-label={tf('Search schemes')}
            className="h-12 pl-10"
          />
        </div>
        <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4" role="group" aria-label={tf('All levels')}>
            <FilterTile
              on={levels.length === 0}
              label={tf('All levels')}
              icon={LayoutGrid}
              onClick={() => setLevels([])}
            />
            {LEVELS.map((item) => (
              <FilterTile
                key={item.id}
                on={levels.includes(item.id)}
                label={tf(item.label)}
                icon={item.icon}
                onClick={() => setLevels((current) => toggleValue(current, item.id))}
              />
            ))}
          </div>
          <div className="h-px bg-border" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" role="group" aria-label={tf('All kinds')}>
            <FilterTile
              on={kinds.length === 0}
              label={tf('All kinds')}
              icon={Layers}
              onClick={() => setKinds([])}
            />
            {KINDS.map((item) => (
              <FilterTile
                key={item.id}
                on={kinds.includes(item.id)}
                label={tf(item.label)}
                icon={item.icon}
                onClick={() => setKinds((current) => toggleValue(current, item.id))}
              />
            ))}
          </div>
          {filtersActive && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={() => {
                  setQuery('');
                  setLevels([]);
                  setKinds([]);
                }}
              >
                <X className="h-4 w-4 mr-1" />
                {tf('Clear')}
              </Button>
            </div>
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
