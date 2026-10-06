/**
 * Per-DPR report style. The scheme preset is only the starting look.
 * A saved style on the DPR wins over the scheme default.
 */

export const FONT_CHOICES = [
  'Times New Roman',
  'Arial',
  'Calibri',
  'Helvetica',
  'Noto Sans Telugu',
] as const;

export type FontChoice = (typeof FONT_CHOICES)[number];

export const PRESET_IDS = ['government', 'bank', 'pmegp', 'apCmep', 'formal', 'minimal'] as const;
export type DocPresetId = (typeof PRESET_IDS)[number];

export const PAGE_SIZES = ['A4', 'A3', 'Letter', 'Legal'] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export const MARGIN_MIN = 10;
export const MARGIN_MAX = 40;

export interface TypeRole {
  family: FontChoice;
  size: number;
  weight: 400 | 600 | 700;
}

export interface DocumentStyle {
  preset: DocPresetId;
  pageSize: PageSize;
  /** Portrait page. Wide money tables can take a landscape sheet. */
  wideTablesLandscape: boolean;
  marginMm: { top: number; right: number; bottom: number; left: number };
  cover: TypeRole;
  sectionTitle: TypeRole;
  body: TypeRole;
  table: TypeRole;
  caption: TypeRole;
  align: 'left' | 'justify';
  lineHeight: number;
  paragraphGap: number;
  colors: { primary: string; header: string; table: string; border: string };
  logoAlign: 'left' | 'center' | 'right';
  logoDataUrl: string;
  agencyName: string;
  headerLine: boolean;
  pageNumberStyle: 'plain' | 'of';
  watermark: string;
  watermarkOpacity: number;
  watermarkAngle: number;
  tableStriped: boolean;
  sectionOrder: string[];
  hiddenSectionIds: string[];
  images: { cover: string; annexure: string; after: Record<string, string> };
}

export const PRESET_LABELS: Record<DocPresetId, string> = {
  government: 'Government',
  bank: 'Bank appraisal',
  pmegp: 'PMEGP',
  apCmep: 'AP CMEP',
  formal: 'Formal',
  minimal: 'Minimal',
};

const DEFAULT_WATERMARK = 'Confidential — for lending appraisal';

function role(family: FontChoice, size: number, weight: TypeRole['weight']): TypeRole {
  return { family, size, weight };
}

function margins(n: number): DocumentStyle['marginMm'] {
  return { top: n, right: n, bottom: n, left: n };
}

function emptyImages(): DocumentStyle['images'] {
  return { cover: '', annexure: '', after: {} };
}

export function presetStyle(id: DocPresetId): DocumentStyle {
  const shared = {
    pageSize: 'A4' as PageSize,
    wideTablesLandscape: false,
    align: 'left' as const,
    lineHeight: 1.45,
    paragraphGap: 6,
    logoAlign: 'left' as const,
    logoDataUrl: '',
    agencyName: '',
    headerLine: true,
    pageNumberStyle: 'of' as const,
    watermark: DEFAULT_WATERMARK,
    watermarkOpacity: 0.12,
    watermarkAngle: -32,
    tableStriped: true,
    sectionOrder: [] as string[],
    hiddenSectionIds: [] as string[],
    images: emptyImages(),
  };

  if (id === 'bank') {
    return {
      ...shared,
      preset: id,
      marginMm: margins(16),
      cover: role('Calibri', 22, 700),
      sectionTitle: role('Calibri', 14, 700),
      body: role('Calibri', 11, 400),
      table: role('Calibri', 9, 600),
      caption: role('Calibri', 9, 400),
      colors: { primary: '#0f172a', header: '#0f172a', table: '#0f766e', border: '#0f172a' },
      align: 'justify',
    };
  }
  if (id === 'pmegp') {
    return {
      ...shared,
      preset: id,
      marginMm: margins(16),
      cover: role('Times New Roman', 22, 700),
      sectionTitle: role('Times New Roman', 14, 700),
      body: role('Times New Roman', 11, 400),
      table: role('Times New Roman', 9, 600),
      caption: role('Times New Roman', 9, 400),
      colors: { primary: '#115e59', header: '#115e59', table: '#0f766e', border: '#115e59' },
      agencyName: 'Khadi & Village Industries Commission',
    };
  }
  if (id === 'apCmep') {
    return {
      ...shared,
      preset: id,
      marginMm: margins(16),
      cover: role('Calibri', 22, 700),
      sectionTitle: role('Calibri', 14, 700),
      body: role('Calibri', 11, 400),
      table: role('Calibri', 9, 600),
      caption: role('Calibri', 9, 400),
      colors: { primary: '#3730a3', header: '#312e81', table: '#3730a3', border: '#3730a3' },
      agencyName: 'Andhra Pradesh MSME',
      wideTablesLandscape: true,
    };
  }
  if (id === 'formal') {
    return {
      ...shared,
      preset: id,
      marginMm: margins(18),
      cover: role('Times New Roman', 20, 700),
      sectionTitle: role('Times New Roman', 13, 700),
      body: role('Times New Roman', 11, 400),
      table: role('Times New Roman', 9, 600),
      caption: role('Times New Roman', 9, 400),
      colors: { primary: '#1c1917', header: '#1c1917', table: '#44403c', border: '#1c1917' },
      align: 'justify',
      tableStriped: false,
    };
  }
  if (id === 'minimal') {
    return {
      ...shared,
      preset: id,
      marginMm: margins(18),
      cover: role('Helvetica', 20, 600),
      sectionTitle: role('Helvetica', 13, 600),
      body: role('Helvetica', 11, 400),
      table: role('Helvetica', 9, 600),
      caption: role('Helvetica', 9, 400),
      colors: { primary: '#111827', header: '#111827', table: '#374151', border: '#6b7280' },
      headerLine: false,
      watermark: '',
      tableStriped: false,
    };
  }
  return {
    ...shared,
    preset: 'government',
    marginMm: margins(16),
    cover: role('Times New Roman', 22, 700),
    sectionTitle: role('Times New Roman', 14, 700),
    body: role('Times New Roman', 11, 400),
    table: role('Times New Roman', 9, 600),
    caption: role('Times New Roman', 9, 400),
    colors: { primary: '#1e3a5f', header: '#1e3a5f', table: '#1e3a5f', border: '#1e3a5f' },
  };
}

export function defaultStyleForScheme(schemeCode?: string | null): DocumentStyle {
  const code = String(schemeCode || '').toUpperCase();
  if (code === 'PMEGP') return presetStyle('pmegp');
  if (code === 'AP_CMEP' || code.includes('CMEP')) return presetStyle('apCmep');
  return presetStyle('government');
}

function isPreset(value: unknown): value is DocPresetId {
  return PRESET_IDS.includes(value as DocPresetId);
}

function isPage(value: unknown): value is PageSize {
  return PAGE_SIZES.includes(value as PageSize);
}

function clampNum(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function clampRole(value: unknown, fallback: TypeRole): TypeRole {
  const v = (value || {}) as Partial<TypeRole>;
  const family = FONT_CHOICES.includes(v.family as FontChoice) ? (v.family as FontChoice) : fallback.family;
  const weight = v.weight === 600 || v.weight === 700 || v.weight === 400 ? v.weight : fallback.weight;
  return {
    family,
    size: clampNum(v.size, 8, 36, fallback.size),
    weight,
  };
}

function hexColor(value: unknown, fallback: string): string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function safeText(value: unknown, fallback: string, max = 160): string {
  if (typeof value !== 'string') return fallback;
  return value.slice(0, max);
}

function safeImage(value: unknown): string {
  if (typeof value !== 'string') return '';
  if (!value.startsWith('data:image/')) return '';
  if (value.length > 500_000) return '';
  return value;
}

export function resolveDocumentStyle(saved: unknown, schemeCode?: string | null): DocumentStyle {
  const base = defaultStyleForScheme(schemeCode);
  if (!saved || typeof saved !== 'object') return base;
  const s = saved as Partial<DocumentStyle>;
  const fromPreset = isPreset(s.preset) ? presetStyle(s.preset) : base;
  const afterRaw = s.images && typeof s.images.after === 'object' && s.images.after ? s.images.after : {};
  const after: Record<string, string> = {};
  for (const [key, value] of Object.entries(afterRaw)) {
    const img = safeImage(value);
    if (img) after[key] = img;
  }
  return {
    ...fromPreset,
    preset: fromPreset.preset,
    pageSize: isPage(s.pageSize) ? s.pageSize : fromPreset.pageSize,
    wideTablesLandscape: typeof s.wideTablesLandscape === 'boolean' ? s.wideTablesLandscape : fromPreset.wideTablesLandscape,
    marginMm: {
      top: clampNum(s.marginMm?.top, MARGIN_MIN, MARGIN_MAX, fromPreset.marginMm.top),
      right: clampNum(s.marginMm?.right, MARGIN_MIN, MARGIN_MAX, fromPreset.marginMm.right),
      bottom: clampNum(s.marginMm?.bottom, MARGIN_MIN, MARGIN_MAX, fromPreset.marginMm.bottom),
      left: clampNum(s.marginMm?.left, MARGIN_MIN, MARGIN_MAX, fromPreset.marginMm.left),
    },
    cover: clampRole(s.cover, fromPreset.cover),
    sectionTitle: clampRole(s.sectionTitle, fromPreset.sectionTitle),
    body: clampRole(s.body, fromPreset.body),
    table: clampRole(s.table, fromPreset.table),
    caption: clampRole(s.caption, fromPreset.caption),
    align: s.align === 'justify' || s.align === 'left' ? s.align : fromPreset.align,
    lineHeight: clampNum(s.lineHeight, 1, 2, fromPreset.lineHeight),
    paragraphGap: clampNum(s.paragraphGap, 0, 24, fromPreset.paragraphGap),
    colors: {
      primary: hexColor(s.colors?.primary, fromPreset.colors.primary),
      header: hexColor(s.colors?.header, fromPreset.colors.header),
      table: hexColor(s.colors?.table, fromPreset.colors.table),
      border: hexColor(s.colors?.border, fromPreset.colors.border),
    },
    logoAlign: s.logoAlign === 'center' || s.logoAlign === 'right' || s.logoAlign === 'left' ? s.logoAlign : fromPreset.logoAlign,
    logoDataUrl: safeImage(s.logoDataUrl),
    agencyName: safeText(s.agencyName, fromPreset.agencyName),
    headerLine: typeof s.headerLine === 'boolean' ? s.headerLine : fromPreset.headerLine,
    pageNumberStyle: s.pageNumberStyle === 'plain' || s.pageNumberStyle === 'of' ? s.pageNumberStyle : fromPreset.pageNumberStyle,
    watermark: safeText(s.watermark, fromPreset.watermark),
    watermarkOpacity: clampNum(s.watermarkOpacity, 0.04, 0.4, fromPreset.watermarkOpacity),
    watermarkAngle: clampNum(s.watermarkAngle, -90, 90, fromPreset.watermarkAngle),
    tableStriped: typeof s.tableStriped === 'boolean' ? s.tableStriped : fromPreset.tableStriped,
    sectionOrder: Array.isArray(s.sectionOrder) ? s.sectionOrder.filter((id) => typeof id === 'string') : [],
    hiddenSectionIds: Array.isArray(s.hiddenSectionIds) ? s.hiddenSectionIds.filter((id) => typeof id === 'string') : [],
    images: {
      cover: safeImage(s.images?.cover),
      annexure: safeImage(s.images?.annexure),
      after,
    },
  };
}

/** Keep section order and pictures when the person picks a new preset. */
export function applyPreset(current: DocumentStyle, id: DocPresetId): DocumentStyle {
  const next = presetStyle(id);
  return {
    ...next,
    sectionOrder: current.sectionOrder,
    hiddenSectionIds: current.hiddenSectionIds,
    images: current.images,
    logoDataUrl: current.logoDataUrl,
    agencyName: current.agencyName || next.agencyName,
    pageSize: current.pageSize,
    marginMm: current.marginMm,
  };
}

export function applySectionOrder<T extends { id: string }>(
  steps: T[],
  style: Pick<DocumentStyle, 'sectionOrder' | 'hiddenSectionIds'>
): T[] {
  const hidden = new Set(style.hiddenSectionIds || []);
  const visible = steps.filter((step) => !hidden.has(step.id));
  const order = style.sectionOrder || [];
  if (!order.length) return visible;
  const rank = new Map(order.map((id, index) => [id, index]));
  return [...visible].sort((a, b) => (rank.get(a.id) ?? 1000) - (rank.get(b.id) ?? 1000));
}

export function moveSection(order: string[], steps: { id: string }[], fromId: string, toId: string): string[] {
  const ids = order.length ? [...order] : steps.map((step) => step.id);
  for (const step of steps) {
    if (!ids.includes(step.id)) ids.push(step.id);
  }
  const from = ids.indexOf(fromId);
  const to = ids.indexOf(toId);
  if (from < 0 || to < 0 || from === to) return ids;
  const [item] = ids.splice(from, 1);
  ids.splice(to, 0, item);
  return ids;
}

function channel(hex: string, index: number): number {
  const n = parseInt(hex.slice(index, index + 2), 16) / 255;
  return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(fg: string, bg: string): number {
  if (!/^#[0-9a-fA-F]{6}$/.test(fg) || !/^#[0-9a-fA-F]{6}$/.test(bg)) return 1;
  const L = (hex: string) => 0.2126 * channel(hex, 1) + 0.7152 * channel(hex, 3) + 0.0722 * channel(hex, 5);
  const a = L(fg);
  const b = L(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Text must stay readable. 3:1 is the floor used by the color controls. */
export function contrastOk(fg: string, bg = '#ffffff'): boolean {
  return contrastRatio(fg, bg) >= 3;
}

export function pageWidthMm(size: PageSize): number {
  if (size === 'A3') return 297;
  if (size === 'Letter' || size === 'Legal') return 216;
  return 210;
}

export function pageHeightMm(size: PageSize): number {
  if (size === 'A3') return 420;
  if (size === 'Letter') return 279;
  if (size === 'Legal') return 356;
  return 297;
}

export function pageBreakBackground(size: PageSize): string {
  const h = pageHeightMm(size);
  return `repeating-linear-gradient(to bottom, #ffffff 0, #ffffff calc(${h}mm - 1px), #94a3b8 calc(${h}mm - 1px), #94a3b8 ${h}mm)`;
}

/** Air at the top and bottom of every page, so a heading does not sit on the edge. */
export const PAGE_EDGE_FLOOR_MM = 12;

export function pageEdgeMm(marginMm: number): number {
  const n = Number(marginMm);
  if (!Number.isFinite(n)) return PAGE_EDGE_FLOOR_MM;
  return Math.max(PAGE_EDGE_FLOOR_MM, n);
}

/**
 * How far to push a block so it stays inside the safe area of one page.
 * A block taller than that area is left alone, because it has to cross a page.
 * Distances are in the same unit (layout pixels).
 */
export function shiftForPageEdge(
  top: number,
  height: number,
  pageHeight: number,
  edgeTop: number,
  edgeBottom: number
): number {
  if (pageHeight <= edgeTop + edgeBottom || height <= 0) return 0;
  const page = Math.floor(Math.max(0, top) / pageHeight);
  const pageStart = page * pageHeight;
  const pageEnd = pageStart + pageHeight;
  const safeTop = pageStart + edgeTop;
  const safeBottom = pageEnd - edgeBottom;
  const room = safeBottom - safeTop;
  if (top < safeTop - 0.5) return safeTop - top;
  if (height <= room && top + height > safeBottom + 0.5) return pageEnd + edgeTop - top;
  return 0;
}

function fontStack(family: string): string {
  if (family === 'Noto Sans Telugu') return '"Noto Sans Telugu", sans-serif';
  if (family === 'Times New Roman') return '"Times New Roman", Times, serif';
  if (family === 'Calibri') return 'Calibri, "Segoe UI", sans-serif';
  if (family === 'Arial') return 'Arial, Helvetica, sans-serif';
  return 'Helvetica, Arial, sans-serif';
}

export function styleCssVars(style: DocumentStyle): Record<string, string> {
  return {
    '--dpr-cover-font': fontStack(style.cover.family),
    '--dpr-cover-size': `${style.cover.size}pt`,
    '--dpr-cover-weight': String(style.cover.weight),
    '--dpr-title-font': fontStack(style.sectionTitle.family),
    '--dpr-title-size': `${style.sectionTitle.size}pt`,
    '--dpr-title-weight': String(style.sectionTitle.weight),
    '--dpr-body-font': fontStack(style.body.family),
    '--dpr-body-size': `${style.body.size}pt`,
    '--dpr-body-weight': String(style.body.weight),
    '--dpr-table-font': fontStack(style.table.family),
    '--dpr-table-size': `${style.table.size}pt`,
    '--dpr-caption-font': fontStack(style.caption.family),
    '--dpr-caption-size': `${style.caption.size}pt`,
    '--dpr-caption-weight': String(style.caption.weight),
    '--dpr-line': String(style.lineHeight),
    '--dpr-para-gap': `${style.paragraphGap}pt`,
    '--dpr-align': style.align,
    '--dpr-primary': style.colors.primary,
    '--dpr-header': style.colors.header,
    '--dpr-table': style.colors.table,
    '--dpr-border': style.colors.border,
    '--dpr-wm-opacity': String(style.watermarkOpacity),
    '--dpr-wm-angle': `${style.watermarkAngle}deg`,
    background: 'transparent',
    padding: `${style.marginMm.top}mm ${style.marginMm.right}mm ${style.marginMm.bottom}mm ${style.marginMm.left}mm`,
  };
}

export interface StyleProblem {
  key: string;
  message: string;
}

export function styleProblems(
  style: DocumentStyle,
  opts: { telugu: boolean; wideTable: boolean }
): StyleProblem[] {
  const problems: StyleProblem[] = [];
  (['top', 'right', 'bottom', 'left'] as const).forEach((side) => {
    const value = style.marginMm[side];
    if (value < MARGIN_MIN || value > MARGIN_MAX) {
      problems.push({ key: `margin-${side}`, message: 'Keep this margin between 10 and 40 mm.' });
    }
  });
  if (!contrastOk(style.colors.primary, '#ffffff')) {
    problems.push({ key: 'primary', message: 'Primary color is too light to read on the page.' });
  }
  if (!contrastOk(style.colors.header, '#ffffff')) {
    problems.push({ key: 'header', message: 'Header color is too light to read on the page.' });
  }
  if (!contrastOk('#ffffff', style.colors.table)) {
    problems.push({ key: 'table', message: 'Table header text would disappear on this color.' });
  }
  if (!contrastOk(style.colors.border, '#ffffff')) {
    problems.push({ key: 'border', message: 'Border color is too light to see.' });
  }
  if (opts.telugu && style.body.family !== 'Noto Sans Telugu') {
    problems.push({ key: 'body-font', message: 'Telugu needs Noto Sans Telugu on body text.' });
  }
  if (opts.wideTable && !style.wideTablesLandscape) {
    problems.push({
      key: 'wide',
      message: 'A wide money table does not fit this page. Turn on landscape for money tables.',
    });
  }
  return problems;
}
