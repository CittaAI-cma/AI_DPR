import { QuestionDef } from './types';

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

export const STORAGE_KEY = 'venture-match-progress';
export const HANDOFF_KEY = 'venture-match-handoff';
