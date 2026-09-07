import { HANDOFF_KEY } from './questions';
import { SchemeMatch, VentureMatchAnswers } from './types';
import en from '@/i18n/locales/en.json';

const ACTIVITY_SECTOR: Record<string, string> = {
  mfg: 'Manufacturing',
  food: 'Food Processing',
  craft: 'Handicrafts',
  service: 'Services',
  trade: 'Trading',
  vending: 'Retail',
  crop: 'Agriculture & Allied',
  mixed: 'Mixed activities',
};

const LEGAL_LABEL: Record<string, string> = {
  sole: 'Sole Proprietorship',
  partnership: 'Partnership / LLP',
  company: 'Private / Public Limited Company',
  unregistered: 'Not registered yet',
  otherEntity: 'SHG / Cooperative / Trust / Society / FPO',
};

const CATEGORY_MAP: Record<string, string> = {
  sc: 'SC',
  st: 'ST',
  bc: 'OBC',
  pwd: 'PHC',
};

const BUDGET_MID: Record<string, number> = {
  under2L: 100_000,
  '2to5L': 350_000,
  '5to10L': 750_000,
  '10to20L': 1_500_000,
  '20to50L': 3_500_000,
  '50Lto1Cr': 7_500_000,
  '1to10Cr': 55_000_000,
  above10Cr: 150_000_000,
};

export interface VentureMatchHandoff {
  answers: VentureMatchAnswers;
  matches: SchemeMatch[];
}

function lookupEn(path: string, fallback: string): string {
  const value = path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, en as unknown);
  return typeof value === 'string' ? value : fallback;
}

export function buildDprPrefill(answers: VentureMatchAnswers, matches: SchemeMatch[]) {
  const owner = answers.owner || [];
  const categories = owner.map((o) => CATEGORY_MAP[o]).filter(Boolean);
  const activity = answers.activity;
  const skipSector = activity === 'notBusiness' || activity === 'notSure';
  const mfgLike = activity === 'mfg' || activity === 'food' || activity === 'craft';
  const stageBlurb =
    answers.stage === 'greenfield'
      ? 'New (greenfield) unit.'
      : answers.stage === 'brownfield'
        ? 'Expansion / upgrade of an existing (brownfield) unit.'
        : answers.stage === 'idea'
          ? 'Idea stage — operations not started.'
          : answers.stage === 'restart'
            ? 'Restarting a closed or sick unit.'
            : '';
  const locationType =
    answers.location === 'rural'
      ? 'Rural'
      : answers.location === 'home'
        ? 'Home-based'
        : answers.location === 'outsideAp'
          ? 'Outside Andhra Pradesh'
          : answers.location
            ? 'Urban'
            : undefined;

  return {
    businessOverview: {
      industrySector: skipSector ? '' : activity && ACTIVITY_SECTOR[activity] ? ACTIVITY_SECTOR[activity] : '',
      businessDescription: stageBlurb,
    },
    applicantInfo: {
      gender: owner.includes('female') ? 'Female' : owner.includes('generalMale') ? 'Male' : undefined,
      locationType,
      categories,
      projectType: skipSector
        ? undefined
        : mfgLike
          ? 'Manufacturing Unit'
          : activity
            ? 'Service Unit'
            : undefined,
      legalStatus: answers.legal ? LEGAL_LABEL[answers.legal] : undefined,
    },
    eligibleSchemes: {
      selectedSchemes: matches.map((m) => m.code),
      schemesData: matches.map((m) => ({
        schemeCode: m.code,
        schemeName: lookupEn(`ventureMatch.schemes.${m.code}.name`, m.name),
        description: lookupEn(m.benefit, m.benefit),
        category: m.kind,
      })),
    },
    ventureMatchBudget:
      answers.budget && answers.budget !== 'none' && answers.budget !== 'notSure'
        ? BUDGET_MID[answers.budget]
        : undefined,
  };
}

export function saveHandoff(answers: VentureMatchAnswers, matches: SchemeMatch[]) {
  const payload: VentureMatchHandoff = { answers, matches };
  localStorage.setItem(HANDOFF_KEY, JSON.stringify(payload));
}

export function peekHandoff(): VentureMatchHandoff | null {
  const raw = localStorage.getItem(HANDOFF_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VentureMatchHandoff;
  } catch {
    return null;
  }
}

export function consumeHandoff(): VentureMatchHandoff | null {
  const raw = localStorage.getItem(HANDOFF_KEY);
  if (!raw) return null;
  localStorage.removeItem(HANDOFF_KEY);
  try {
    return JSON.parse(raw) as VentureMatchHandoff;
  } catch {
    return null;
  }
}
