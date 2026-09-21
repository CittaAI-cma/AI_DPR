import { QuestionDef, VentureMatchAnswers } from './types';

export const QUESTIONS: QuestionDef[] = [
  {
    id: 'activity',
    optionIds: [
      'mfg',
      'knowledge',
      'food',
      'craft',
      'service',
      'trade',
      'vending',
      'crop',
      'mixed',
      'notSure',
      'notBusiness',
    ],
  },
  {
    id: 'stage',
    optionIds: ['greenfield', 'brownfield', 'idea', 'restart', 'notSure'],
  },
  {
    id: 'supportType',
    optionIds: [
      'loanOrSubsidy',
      'guarantee',
      'certification',
      'training',
      'marketingFair',
      'clusterCfc',
      'notSure',
    ],
  },
  {
    id: 'upgradeIntent',
    optionIds: [
      'expandSameLine',
      'techUpgrade',
      'secondPmegpLoan',
      'workingCapitalOnly',
      'notSure',
    ],
    when: (a) => a.stage === 'brownfield' || a.stage === 'restart',
  },
  {
    id: 'qualityGoal',
    optionIds: ['zed', 'lean', 'ipr', 'none', 'notSure'],
    when: (a) => a.supportType === 'certification',
  },
  {
    id: 'sectorFlag',
    optionIds: ['none', 'pharma', 'coir', 'handloom', 'notSure'],
    when: (a) => a.activity === 'mfg' || a.activity === 'craft' || a.activity === 'food',
  },
  {
    id: 'budget',
    optionIds: [
      'under2L',
      '2to5L',
      '5to10L',
      '10to20L',
      '20to50L',
      '50Lto1Cr',
      '1to10Cr',
      'above10Cr',
      'none',
      'notSure',
    ],
  },
  {
    id: 'legal',
    optionIds: ['sole', 'partnership', 'company', 'unregistered', 'otherEntity', 'notSure'],
  },
  {
    id: 'owner',
    multi: true,
    optionIds: [
      'female',
      'sc',
      'st',
      'bc',
      'pwd',
      'transgender',
      'exServiceman',
      'generalMale',
      'notDecided',
      'noMajority',
      'notSure',
    ],
  },
  {
    id: 'procurementInterest',
    optionIds: ['yes', 'no', 'notSure'],
    when: (a) => (a.owner || []).some((o) => o === 'sc' || o === 'st'),
  },
  {
    id: 'domicile',
    optionIds: ['ap', 'other', 'planningAp', 'notSure'],
  },
  {
    id: 'location',
    optionIds: ['urban', 'rural', 'apiic', 'home', 'outsideAp', 'notDecided'],
  },
  {
    id: 'riceCard',
    optionIds: ['yes', 'no', 'otherCard', 'notSure'],
  },
  {
    id: 'age',
    optionIds: ['under18', '18to20', '21to50', '51to60', 'above60', 'notSure'],
  },
  {
    id: 'education',
    optionIds: ['below8th', '8thPlus', 'notSure'],
  },
  {
    id: 'udyam',
    optionIds: ['yes', 'willing', 'applied', 'refuse', 'notSure'],
  },
  {
    id: 'priorSubsidy',
    optionIds: ['none', 'repaid', 'outstanding', 'notSure'],
  },
  {
    id: 'govtFamily',
    optionIds: ['yes', 'no', 'notSure'],
  },
  {
    id: 'market',
    optionIds: ['offline', 'ecommerce', 'export', 'both', 'notSellingYet', 'notSure'],
  },
];

/** Questions visible for the current answer set (conditional gating). */
export function getVisibleQuestions(answers: VentureMatchAnswers): QuestionDef[] {
  return QUESTIONS.filter((q) => !q.when || q.when(answers));
}

/** Drop answers for questions that are no longer visible after a gating change. */
export function pruneInvisibleAnswers(answers: VentureMatchAnswers): VentureMatchAnswers {
  const next: VentureMatchAnswers = { ...answers };
  for (const q of QUESTIONS) {
    if (q.when && !q.when(next) && next[q.id] !== undefined) {
      delete next[q.id];
    }
  }
  return next;
}

export const STORAGE_KEY = 'venture-match-progress';
export const HANDOFF_KEY = 'venture-match-handoff';
