/** Latest DPR download name: scheme_project_eng|tel_DDMMYY.ext */
export function dprDownloadName(options: {
  schemeCode?: string | null;
  projectName?: string | null;
  language?: string | null;
  date?: Date;
  ext: string;
}): string {
  const scheme = slugToken(options.schemeCode || 'DPR');
  const project = slugToken(options.projectName || 'Project');
  const lang = shortLanguage(options.language);
  const when = options.date || new Date();
  const dd = String(when.getDate()).padStart(2, '0');
  const mm = String(when.getMonth() + 1).padStart(2, '0');
  const yy = String(when.getFullYear()).slice(-2);
  const ext = options.ext.replace(/^\./, '');
  return `${scheme}_${project}_${lang}_${dd}${mm}${yy}.${ext}`;
}

function shortLanguage(language?: string | null): 'eng' | 'tel' {
  const value = String(language || '').toLowerCase();
  if (value === 'te' || value === 'tel' || value === 'telugu') return 'tel';
  return 'eng';
}

function slugToken(value: string): string {
  const cleaned = value
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || 'Project';
}
