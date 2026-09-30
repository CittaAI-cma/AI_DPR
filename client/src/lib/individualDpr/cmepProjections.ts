export type CmepLineKey = 'sales' | 'rm' | 'wages' | 'power' | 'netProfit';

export const CMEP_LINE_ITEMS: { key: CmepLineKey; label: string }[] = [
  { key: 'sales', label: 'Sales realisation' },
  { key: 'rm', label: 'Raw material' },
  { key: 'wages', label: 'Wages' },
  { key: 'power', label: 'Power' },
  { key: 'netProfit', label: 'Net profit' },
];

export type CmepYearColumn = {
  label: string;
  period: 'previous' | 'projected';
  sales: number;
  rm: number;
  wages: number;
  power: number;
  netProfit: number;
};

function fyLabel(startYear: number): string {
  return `${startYear}-${startYear + 1}`;
}

function blankColumn(label: string, period: CmepYearColumn['period']): CmepYearColumn {
  return { label, period, sales: 0, rm: 0, wages: 0, power: 0, netProfit: 0 };
}

/** Three completed financial years, then five years from the current FY (April–March). */
export function cmepProjectionColumns(now = new Date()): CmepYearColumn[] {
  const month = now.getMonth();
  const year = now.getFullYear();
  const currentFyStart = month >= 3 ? year : year - 1;
  const cols: CmepYearColumn[] = [];
  for (let i = 3; i >= 1; i -= 1) {
    cols.push(blankColumn(fyLabel(currentFyStart - i), 'previous'));
  }
  for (let i = 0; i < 5; i += 1) {
    cols.push(blankColumn(fyLabel(currentFyStart + i), 'projected'));
  }
  return cols;
}

function asNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  return Number.isFinite(n) ? n : 0;
}

function coerceColumn(raw: Record<string, unknown>, fallback: CmepYearColumn): CmepYearColumn {
  const period = raw.period === 'previous' || raw.period === 'projected' ? raw.period : fallback.period;
  return {
    label: String(raw.label || fallback.label),
    period,
    sales: asNumber(raw.sales),
    rm: asNumber(raw.rm),
    wages: asNumber(raw.wages),
    power: asNumber(raw.power),
    netProfit: asNumber(raw.netProfit),
  };
}

function isSavedColumn(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return typeof row.label === 'string' && (row.period === 'previous' || row.period === 'projected');
}

/** Keeps a saved CMEP grid. Maps an older Year-1…5 list onto the projected columns. */
export function normalizeCmepProjections(raw: unknown, now = new Date()): CmepYearColumn[] {
  const defaults = cmepProjectionColumns(now);
  if (!Array.isArray(raw) || raw.length === 0) return defaults;

  if (raw.every(isSavedColumn)) {
    const byLabel = new Map(raw.map((row) => [String(row.label), row]));
    const sameShape = defaults.every((col) => byLabel.has(col.label));
    if (sameShape) {
      return defaults.map((col) => coerceColumn(byLabel.get(col.label) as Record<string, unknown>, col));
    }
    return raw.filter(isSavedColumn).map((row, index) => coerceColumn(row, defaults[index] || defaults[0]));
  }

  const legacy = raw.filter((row) => row && typeof row === 'object' && 'year' in (row as object));
  if (!legacy.length) return defaults;
  const projected = defaults.filter((col) => col.period === 'projected');
  legacy.forEach((row, index) => {
    const target = projected[index];
    if (!target) return;
    const source = row as Record<string, unknown>;
    target.sales = asNumber(source.sales);
    target.rm = asNumber(source.rm);
    target.wages = asNumber(source.wages);
    target.power = asNumber(source.power);
    target.netProfit = asNumber(source.netProfit);
  });
  return defaults;
}

/** Put a Year-1…5 suggestion onto the projected columns and keep previous-year actuals. */
export function mergeCmepProjectedSuggestion(existing: unknown, suggestion: unknown): CmepYearColumn[] {
  const columns = normalizeCmepProjections(existing);
  const incoming = normalizeCmepProjections(suggestion);
  const projectedIncoming = incoming.filter((col) => col.period === 'projected');
  const legacy = Array.isArray(suggestion) ? suggestion : [];
  const source = projectedIncoming.some((col) => col.sales || col.rm || col.wages || col.power || col.netProfit)
    ? projectedIncoming
    : legacy;
  let slot = 0;
  return columns.map((col) => {
    if (col.period !== 'projected') return col;
    const row = source[slot];
    slot += 1;
    if (!row || typeof row !== 'object') return col;
    const item = row as Record<string, unknown>;
    return {
      ...col,
      sales: asNumber(item.sales),
      rm: asNumber(item.rm),
      wages: asNumber(item.wages),
      power: asNumber(item.power),
      netProfit: asNumber(item.netProfit),
    };
  });
}

export function cmepProjectionsHaveFigures(columns: CmepYearColumn[]): boolean {
  return columns.some((col) =>
    CMEP_LINE_ITEMS.some((line) => col[line.key] !== 0)
  );
}
