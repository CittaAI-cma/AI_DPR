export type BriefLang = 'en' | 'te';

export type Loc = { en: string; te: string };

export type SchemeBriefTab = 'benefits' | 'eligibility' | 'howToApply' | 'documents' | 'faqs';

export interface SchemeFaq {
  q: Loc;
  a: Loc;
}

export interface SchemeQuickInfo {
  ministry: Loc;
  category: Loc;
  type: Loc;
  status: Loc;
}

export interface SchemeBrief {
  code: string;
  title: Loc;
  intro: Loc;
  benefits: Loc[];
  eligibility: Loc[];
  howToApply: Loc[];
  documents: Loc[];
  faqs: SchemeFaq[];
  quickInfo: SchemeQuickInfo;
  sourceUrl: string;
}

export const ACTIVE: Loc = { en: 'Active', te: 'క్రియాశీలం' };
export const CENTRAL: Loc = { en: 'Central Scheme', te: 'కేంద్ర పథకం' };
export const STATE: Loc = { en: 'State Scheme', te: 'రాష్ట్ర పథకం' };

export function loc(text: Loc, lang: BriefLang): string {
  return (lang === 'te' ? text.te : text.en) || text.en;
}

export function L(en: string, te: string): Loc {
  return { en, te };
}
