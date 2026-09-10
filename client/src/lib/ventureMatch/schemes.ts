import {
  Age,
  Budget,
  CriterionStatus,
  Legal,
  LocationType,
  OwnerTag,
  SchemeRule,
  Udyam,
  VentureMatchAnswers,
} from './types';

const NUMERIC_BUDGETS: Budget[] = [
  'under2L',
  '2to5L',
  '5to10L',
  '10to20L',
  '20to50L',
  '50Lto1Cr',
  '1to10Cr',
  'above10Cr',
];
const OBMMS_OWNERS: OwnerTag[] = ['sc', 'st', 'bc', 'pwd'];
const OBMMS_AGES: Age[] = ['21to50', '51to60'];
const SPECIAL_OWNERS: OwnerTag[] = ['female', 'sc', 'st', 'bc', 'pwd'];
const UDYAM_READY: Udyam[] = ['yes', 'willing', 'applied'];
const FIRM_LEGAL: Legal[] = ['sole', 'partnership', 'company'];
const AP_LOCATION: LocationType[] = ['urban', 'rural', 'apiic', 'home', 'notDecided'];
const EDP_LOCATION: LocationType[] = ['urban', 'rural', 'apiic'];

function requireValue<T>(
  value: T | undefined,
  predicate: (v: T) => boolean
): CriterionStatus {
  if (value === undefined || value === null) return 'unknown';
  return predicate(value) ? 'pass' : 'fail';
}

function passIf<T>(value: T | undefined, allowed: readonly T[]): CriterionStatus {
  return requireValue(value, (v) => allowed.includes(v));
}

function owners(answers: VentureMatchAnswers): OwnerTag[] | undefined {
  if (!answers.owner || answers.owner.length === 0) return undefined;
  return answers.owner;
}

function isSpecialCategory(answers: VentureMatchAnswers): boolean {
  return (answers.owner || []).some((o) => SPECIAL_OWNERS.includes(o));
}

export function shouldShowOwnershipHint(answers: VentureMatchAnswers): boolean {
  const tags = answers.owner || [];
  return tags.includes('generalMale') && !tags.includes('female');
}

export function blocksAllSchemes(answers: VentureMatchAnswers): boolean {
  return answers.activity === 'notBusiness' || answers.activity === 'notSure';
}

function apBoosted(answers: VentureMatchAnswers): boolean {
  return answers.domicile === 'ap' && isSpecialCategory(answers);
}

/** Andhra Pradesh state schemes only (Industries / Welfare / APIIC). */
export const SCHEMES: SchemeRule[] = [
  {
    code: 'AP_EDP',
    name: 'AP MSME-EDP 4.0',
    kind: 'subsidy',
    benefit: (a) => (apBoosted(a) ? 'ventureMatch.benefits.apEdpBoost' : 'ventureMatch.benefits.apEdp'),
    criteria: [
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.manufacturing',
        test: (a) => passIf(a.activity, ['mfg']),
      },
      {
        id: 'stage',
        questionId: 'stage',
        labelKey: 'ventureMatch.criteria.greenfield',
        test: (a) => passIf(a.stage, ['greenfield']),
      },
      {
        id: 'domicile',
        questionId: 'domicile',
        labelKey: 'ventureMatch.criteria.apDomicile',
        test: (a) => passIf(a.domicile, ['ap']),
      },
      {
        id: 'location',
        questionId: 'location',
        labelKey: 'ventureMatch.criteria.apUnitLocation',
        test: (a) => passIf(a.location, EDP_LOCATION),
      },
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalApEdp',
        test: (a) => passIf(a.legal, FIRM_LEGAL),
      },
      {
        id: 'udyam',
        questionId: 'udyam',
        labelKey: 'ventureMatch.criteria.udyam',
        test: (a) => passIf(a.udyam, UDYAM_READY),
      },
      {
        id: 'budget',
        questionId: 'budget',
        labelKey: 'ventureMatch.criteria.budgetRequired',
        test: (a) => passIf(a.budget, NUMERIC_BUDGETS),
      },
    ],
  },
  {
    code: 'AP_FPP',
    name: 'AP Food Processing Policy 4.0',
    kind: 'subsidy',
    benefit: (a) => (apBoosted(a) ? 'ventureMatch.benefits.apFppBoost' : 'ventureMatch.benefits.apFpp'),
    criteria: [
      {
        id: 'domicile',
        questionId: 'domicile',
        labelKey: 'ventureMatch.criteria.apDomicile',
        test: (a) => passIf(a.domicile, ['ap']),
      },
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.foodProcessing',
        test: (a) => passIf(a.activity, ['food']),
      },
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalPmfme',
        test: (a) => passIf(a.legal, ['sole', 'partnership', 'company', 'otherEntity'] as Legal[]),
      },
      {
        id: 'location',
        questionId: 'location',
        labelKey: 'ventureMatch.criteria.apLocation',
        test: (a) => passIf(a.location, AP_LOCATION),
      },
      {
        id: 'udyam',
        questionId: 'udyam',
        labelKey: 'ventureMatch.criteria.udyam',
        test: (a) => passIf(a.udyam, UDYAM_READY),
      },
    ],
  },
  {
    code: 'AP_TECH_UPGRADE',
    name: 'AP Technology Upgradation Subsidy',
    kind: 'subsidy',
    benefit: () => 'ventureMatch.benefits.apTech',
    criteria: [
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.manufacturing',
        test: (a) => passIf(a.activity, ['mfg']),
      },
      {
        id: 'stage',
        questionId: 'stage',
        labelKey: 'ventureMatch.criteria.brownfield',
        test: (a) => passIf(a.stage, ['brownfield', 'restart']),
      },
      {
        id: 'domicile',
        questionId: 'domicile',
        labelKey: 'ventureMatch.criteria.apDomicile',
        test: (a) => passIf(a.domicile, ['ap']),
      },
      {
        id: 'location',
        questionId: 'location',
        labelKey: 'ventureMatch.criteria.apLocation',
        test: (a) => passIf(a.location, AP_LOCATION),
      },
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalRegistered',
        test: (a) => passIf(a.legal, FIRM_LEGAL),
      },
    ],
  },
  {
    code: 'OBMMS',
    name: 'AP State Welfare Corporation Self-Employment Loans (OBMMS)',
    kind: 'subsidy',
    benefit: () => 'ventureMatch.benefits.obmms',
    criteria: [
      {
        id: 'domicile',
        questionId: 'domicile',
        labelKey: 'ventureMatch.criteria.apDomicile',
        test: (a) => passIf(a.domicile, ['ap']),
      },
      {
        id: 'owner',
        questionId: 'owner',
        labelKey: 'ventureMatch.criteria.socialCategory',
        test: (a) =>
          requireValue(owners(a), (tags) => tags.some((o) => OBMMS_OWNERS.includes(o))),
      },
      {
        id: 'riceCard',
        questionId: 'riceCard',
        labelKey: 'ventureMatch.criteria.riceCard',
        test: (a) => passIf(a.riceCard, ['yes']),
      },
      {
        id: 'age',
        questionId: 'age',
        labelKey: 'ventureMatch.criteria.age21to60',
        test: (a) => passIf(a.age, OBMMS_AGES),
      },
      {
        id: 'stage',
        questionId: 'stage',
        labelKey: 'ventureMatch.criteria.obmmsStage',
        test: (a) => passIf(a.stage, ['greenfield', 'brownfield', 'restart']),
      },
      {
        id: 'budget',
        questionId: 'budget',
        labelKey: 'ventureMatch.criteria.budgetRequired',
        test: (a) => passIf(a.budget, NUMERIC_BUDGETS),
      },
      {
        id: 'location',
        questionId: 'location',
        labelKey: 'ventureMatch.criteria.apLocation',
        test: (a) => passIf(a.location, AP_LOCATION),
      },
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalObmms',
        test: (a) => passIf(a.legal, ['unregistered', 'sole'] as Legal[]),
      },
    ],
  },
  {
    code: 'AP_PARKS',
    name: 'AP MSME-PARKS land-cost rebate',
    kind: 'subsidy',
    benefit: () => 'ventureMatch.benefits.apParks',
    criteria: [
      {
        id: 'location',
        questionId: 'location',
        labelKey: 'ventureMatch.criteria.apiic',
        test: (a) => passIf(a.location, ['apiic']),
      },
      {
        id: 'domicile',
        questionId: 'domicile',
        labelKey: 'ventureMatch.criteria.apDomicile',
        test: (a) => passIf(a.domicile, ['ap']),
      },
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalRegistered',
        test: (a) => passIf(a.legal, FIRM_LEGAL),
      },
    ],
  },
];
