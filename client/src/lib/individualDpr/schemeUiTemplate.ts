/**
 * Scheme-specific UI / live-DPR templates.
 * Only PMEGP and AP CMEP have distinct skins for now; others use the default shell.
 */

export type SchemeUiTemplateId = 'PMEGP' | 'AP_CMEP';

export type SchemeUiTemplate = {
  id: SchemeUiTemplateId;
  /** Short badge on form banner + document cover */
  badge: string;
  /** One-line pack description under the badge */
  tagline: string;
  /** Sticky form banner */
  bannerClass: string;
  /** Active step chip */
  stepActiveClass: string;
  /** Form card shell */
  formShellClass: string;
  /** Live preview / PDF document root modifier */
  documentClass: string;
  /** Cover kicker override */
  coverKicker: string;
};

const TEMPLATES: Record<SchemeUiTemplateId, SchemeUiTemplate> = {
  PMEGP: {
    id: 'PMEGP',
    badge: 'PMEGP · KVIC unit pack',
    tagline: 'Credit-linked margin money · bank-style single-unit DPR',
    bannerClass:
      'bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border-b border-teal-200',
    stepActiveClass: 'bg-teal-700 text-white shadow-sm',
    formShellClass: 'scheme-tpl-pmegp border-teal-200/80 shadow-teal-900/5',
    documentClass: 'tpl-pmegp',
    coverKicker: 'PMEGP DETAILED PROJECT REPORT',
  },
  AP_CMEP: {
    id: 'AP_CMEP',
    badge: 'AP CMEP · State credit-linked',
    tagline: 'Andhra Pradesh CMEP · bank loan required · manufacturing / knowledge',
    bannerClass:
      'bg-gradient-to-r from-indigo-50 via-sky-50 to-amber-50 border-b border-indigo-200',
    stepActiveClass: 'bg-indigo-800 text-white shadow-sm',
    formShellClass: 'scheme-tpl-ap-cmep border-indigo-200/80 shadow-indigo-900/5',
    documentClass: 'tpl-ap-cmep',
    coverKicker: 'AP CMEP DETAILED PROJECT REPORT',
  },
};

export function getSchemeUiTemplate(schemeCode?: string | null): SchemeUiTemplate | null {
  if (schemeCode === 'PMEGP' || schemeCode === 'AP_CMEP') {
    return TEMPLATES[schemeCode];
  }
  return null;
}
