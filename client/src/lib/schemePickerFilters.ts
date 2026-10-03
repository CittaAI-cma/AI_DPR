export type SchemeLevel = 'central' | 'state' | 'bank';
export type SchemeKind = 'subsidy' | 'loan' | 'guarantee' | 'other';

export function schemeLevel(typeEn: string): SchemeLevel {
  if (typeEn === 'Central Scheme') return 'central';
  if (typeEn === 'State Scheme') return 'state';
  return 'bank';
}

export function schemeKind(categoryEn: string): SchemeKind {
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

/** A card matches when every active filter group contains it. An empty group means all. */
export function cardMatchesFilters(
  card: { level: SchemeLevel; kind: SchemeKind; haystack: string },
  levels: SchemeLevel[],
  kinds: SchemeKind[],
  query: string
): boolean {
  if (levels.length > 0 && !levels.includes(card.level)) return false;
  if (kinds.length > 0 && !kinds.includes(card.kind)) return false;
  const q = query.trim().toLowerCase();
  if (q && !card.haystack.includes(q)) return false;
  return true;
}
