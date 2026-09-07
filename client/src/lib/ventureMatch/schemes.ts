import {
  Activity,
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

const BUDGET_MIN: Record<Exclude<Budget, 'none' | 'notSure'>, number> = {
  under2L: 0,
  '2to5L': 200_000,
  '5to10L': 500_000,
  '10to20L': 1_000_000,
  '20to50L': 2_000_000,
  '50Lto1Cr': 5_000_000,
  '1to10Cr': 10_000_000,
  above10Cr: 100_000_000,
};

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
const PMFME_BUDGETS: Budget[] = ['under2L', '2to5L', '5to10L', '10to20L', '20to50L'];
const CGTMSE_BUDGETS: Budget[] = [
  'under2L',
  '2to5L',
  '5to10L',
  '10to20L',
  '20to50L',
  '50Lto1Cr',
  '1to10Cr',
];
const MFG_LIKE: Activity[] = ['mfg', 'food', 'craft'];
const SERVICE_LIKE: Activity[] = ['service', 'trade', 'vending'];
const ENTERPRISE_ACTIVITIES: Activity[] = [
  'mfg',
  'food',
  'craft',
  'service',
  'trade',
  'vending',
  'mixed',
];
const OBMMS_OWNERS: OwnerTag[] = ['sc', 'st', 'bc', 'pwd'];
const STANDUP_OWNERS: OwnerTag[] = ['female', 'sc', 'st'];
const OBMMS_AGES: Age[] = ['21to50', '51to60'];
const SPECIAL_OWNERS: OwnerTag[] = ['female', 'sc', 'st', 'bc', 'pwd'];
const AGE_18_PLUS: Age[] = ['18to20', '21to50', '51to60', 'above60'];
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

function budgetMin(answers: VentureMatchAnswers): number | undefined {
  const band = answers.budget;
  if (!band || band === 'none' || band === 'notSure') return undefined;
  return BUDGET_MIN[band];
}

function requireNumericBudget(
  answers: VentureMatchAnswers,
  predicate: (min: number, band: Exclude<Budget, 'none' | 'notSure'>) => boolean
): CriterionStatus {
  const band = answers.budget;
  if (band === undefined) return 'unknown';
  if (band === 'none' || band === 'notSure') return 'fail';
  return predicate(BUDGET_MIN[band], band) ? 'pass' : 'fail';
}

function isSpecialCategory(answers: VentureMatchAnswers): boolean {
  return (answers.owner || []).some((o) => SPECIAL_OWNERS.includes(o));
}

function isFemale(answers: VentureMatchAnswers): boolean {
  return (answers.owner || []).includes('female');
}

export function shouldShowOwnershipHint(answers: VentureMatchAnswers): boolean {
  const tags = answers.owner || [];
  return tags.includes('generalMale') && !tags.includes('female');
}

export function blocksAllSchemes(answers: VentureMatchAnswers): boolean {
  return answers.activity === 'notBusiness' || answers.activity === 'notSure';
}

function pmegpSubsidy(answers: VentureMatchAnswers): string {
  const special = owners(answers) ? isSpecialCategory(answers) : false;
  const rural = answers.location === 'rural';
  if (rural && special) return 'ventureMatch.benefits.pmegpRuralSpecial';
  if (!rural && special) return 'ventureMatch.benefits.pmegpUrbanSpecial';
  if (rural) return 'ventureMatch.benefits.pmegpRural';
  return 'ventureMatch.benefits.pmegpUrban';
}

function apBoosted(answers: VentureMatchAnswers): boolean {
  return answers.domicile === 'ap' && isSpecialCategory(answers);
}

function pmegpEducation(answers: VentureMatchAnswers): CriterionStatus {
  const activity = answers.activity;
  if (!activity) return 'unknown';

  let threshold: number | undefined;
  if (MFG_LIKE.includes(activity)) threshold = 1_000_000;
  else if (SERVICE_LIKE.includes(activity) || activity === 'mixed') threshold = 500_000;

  if (threshold === undefined) return 'pass';
  const band = answers.budget;
  if (band === undefined) return 'unknown';
  if (band === 'none' || band === 'notSure') return 'fail';
  if (BUDGET_MIN[band] < threshold) return 'pass';
  return passIf(answers.education, ['8thPlus']);
}

function pmegpStage(answers: VentureMatchAnswers): CriterionStatus {
  if (!answers.stage) return 'unknown';
  if (answers.stage === 'idea') return 'unknown';
  return answers.stage === 'greenfield' ? 'pass' : 'fail';
}

export const SCHEMES: SchemeRule[] = [
  {
    code: 'SVANIDHI',
    name: 'PM SVANidhi',
    kind: 'loan',
    benefit: () => 'ventureMatch.benefits.svanidhi',
    criteria: [
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.streetVending',
        test: (a) => passIf(a.activity, ['vending']),
      },
      {
        id: 'location',
        questionId: 'location',
        labelKey: 'ventureMatch.criteria.urban',
        test: (a) => passIf(a.location, ['urban']),
      },
      {
        id: 'age',
        questionId: 'age',
        labelKey: 'ventureMatch.criteria.age18',
        test: (a) => passIf(a.age, AGE_18_PLUS),
      },
    ],
  },
  {
    code: 'VISHWAKARMA',
    name: 'PM Vishwakarma',
    kind: 'subsidy',
    benefit: () => 'ventureMatch.benefits.vishwakarma',
    criteria: [
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.craft',
        test: (a) => passIf(a.activity, ['craft']),
      },
      {
        id: 'age',
        questionId: 'age',
        labelKey: 'ventureMatch.criteria.age18',
        test: (a) => passIf(a.age, AGE_18_PLUS),
      },
      {
        id: 'priorSubsidy',
        questionId: 'priorSubsidy',
        labelKey: 'ventureMatch.criteria.noOutstandingSubsidy',
        test: (a) => passIf(a.priorSubsidy, ['none', 'repaid']),
      },
      {
        id: 'govtFamily',
        questionId: 'govtFamily',
        labelKey: 'ventureMatch.criteria.noGovtFamily',
        test: (a) => passIf(a.govtFamily, ['no']),
      },
    ],
  },
  {
    code: 'PMFME',
    name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    kind: 'subsidy',
    benefit: () => 'ventureMatch.benefits.pmfme',
    criteria: [
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.foodProcessing',
        test: (a) => passIf(a.activity, ['food']),
      },
      {
        id: 'budget',
        questionId: 'budget',
        labelKey: 'ventureMatch.criteria.budgetPmFme',
        test: (a) => passIf(a.budget, PMFME_BUDGETS),
      },
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalPmfme',
        test: (a) => passIf(a.legal, ['sole', 'partnership', 'otherEntity'] as Legal[]),
      },
      {
        id: 'education',
        questionId: 'education',
        labelKey: 'ventureMatch.criteria.education8th',
        test: (a) => passIf(a.education, ['8thPlus']),
      },
    ],
  },
  {
    code: 'PMEGP',
    name: 'Prime Minister’s Employment Generation Programme (PMEGP)',
    kind: 'subsidy',
    benefit: (a) => pmegpSubsidy(a),
    criteria: [
      {
        id: 'stage',
        questionId: 'stage',
        labelKey: 'ventureMatch.criteria.greenfield',
        test: pmegpStage,
      },
      {
        id: 'age',
        questionId: 'age',
        labelKey: 'ventureMatch.criteria.age18',
        test: (a) => passIf(a.age, AGE_18_PLUS),
      },
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.enterpriseActivity',
        test: (a) => passIf(a.activity, ENTERPRISE_ACTIVITIES),
      },
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalPmegp',
        test: (a) => passIf(a.legal, FIRM_LEGAL),
      },
      {
        id: 'budget',
        questionId: 'budget',
        labelKey: 'ventureMatch.criteria.budgetRequired',
        test: (a) => passIf(a.budget, NUMERIC_BUDGETS),
      },
      {
        id: 'education',
        questionId: 'education',
        labelKey: 'ventureMatch.criteria.pmegpEducation',
        test: pmegpEducation,
      },
    ],
  },
  {
    code: 'STANDUP',
    name: 'Stand-Up India',
    kind: 'loan',
    benefit: () => 'ventureMatch.benefits.standup',
    criteria: [
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.enterpriseActivity',
        test: (a) => passIf(a.activity, ENTERPRISE_ACTIVITIES),
      },
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalRegistered',
        test: (a) => passIf(a.legal, FIRM_LEGAL),
      },
      {
        id: 'stage',
        questionId: 'stage',
        labelKey: 'ventureMatch.criteria.greenfield',
        test: (a) => passIf(a.stage, ['greenfield']),
      },
      {
        id: 'owner',
        questionId: 'owner',
        labelKey: 'ventureMatch.criteria.womanScSt',
        test: (a) =>
          requireValue(owners(a), (tags) => tags.some((o) => STANDUP_OWNERS.includes(o))),
      },
      {
        id: 'budgetMin',
        questionId: 'budget',
        labelKey: 'ventureMatch.criteria.standupMin',
        test: (a) => requireNumericBudget(a, (min) => min >= 1_000_000),
      },
      {
        id: 'budgetMax',
        questionId: 'budget',
        labelKey: 'ventureMatch.criteria.standupMax',
        test: (a) => requireNumericBudget(a, (min) => min <= 10_000_000),
      },
      {
        id: 'age',
        questionId: 'age',
        labelKey: 'ventureMatch.criteria.age18',
        test: (a) => passIf(a.age, AGE_18_PLUS),
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
    code: 'MUDRA',
    name: 'Pradhan Mantri MUDRA Yojana',
    kind: 'loan',
    benefit: () => 'ventureMatch.benefits.mudra',
    criteria: [
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.enterpriseActivity',
        test: (a) => passIf(a.activity, ENTERPRISE_ACTIVITIES),
      },
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalRegistered',
        test: (a) => passIf(a.legal, FIRM_LEGAL),
      },
      {
        id: 'budget',
        questionId: 'budget',
        labelKey: 'ventureMatch.criteria.mudraCap',
        test: (a) =>
          requireNumericBudget(a, (min) => min <= 2_000_000),
      },
      {
        id: 'age',
        questionId: 'age',
        labelKey: 'ventureMatch.criteria.age18',
        test: (a) => passIf(a.age, AGE_18_PLUS),
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
    code: 'CGTMSE',
    name: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
    kind: 'guarantee',
    benefit: (a) =>
      isFemale(a) ? 'ventureMatch.benefits.cgtmseWomen' : 'ventureMatch.benefits.cgtmse',
    criteria: [
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalRegistered',
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
        labelKey: 'ventureMatch.criteria.budgetUnder10Cr',
        test: (a) => passIf(a.budget, CGTMSE_BUDGETS),
      },
      {
        id: 'activity',
        questionId: 'activity',
        labelKey: 'ventureMatch.criteria.enterpriseActivity',
        test: (a) => passIf(a.activity, ENTERPRISE_ACTIVITIES),
      },
    ],
  },
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
    code: 'MSE_SPICE',
    name: 'RAMP MSE-SPICE',
    kind: 'subsidy',
    benefit: () => 'ventureMatch.benefits.mseSpice',
    criteria: [
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalRegistered',
        test: (a) => passIf(a.legal, FIRM_LEGAL),
      },
      {
        id: 'stage',
        questionId: 'stage',
        labelKey: 'ventureMatch.criteria.brownfield',
        test: (a) => passIf(a.stage, ['brownfield', 'restart']),
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
  {
    code: 'RAMP_TEAM',
    name: 'RAMP TEAM (ONDC)',
    kind: 'support',
    benefit: () => 'ventureMatch.benefits.rampTeam',
    criteria: [
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalRegistered',
        test: (a) => passIf(a.legal, FIRM_LEGAL),
      },
      {
        id: 'market',
        questionId: 'market',
        labelKey: 'ventureMatch.criteria.ecommerce',
        test: (a) => passIf(a.market, ['ecommerce', 'both']),
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
    code: 'EPM_NIRYAT',
    name: 'EPM Niryat Protsahan',
    kind: 'subsidy',
    benefit: () => 'ventureMatch.benefits.epmNiryat',
    criteria: [
      {
        id: 'legal',
        questionId: 'legal',
        labelKey: 'ventureMatch.criteria.legalRegistered',
        test: (a) => passIf(a.legal, FIRM_LEGAL),
      },
      {
        id: 'market',
        questionId: 'market',
        labelKey: 'ventureMatch.criteria.export',
        test: (a) => passIf(a.market, ['export']),
      },
      {
        id: 'udyam',
        questionId: 'udyam',
        labelKey: 'ventureMatch.criteria.udyam',
        test: (a) => passIf(a.udyam, UDYAM_READY),
      },
    ],
  },
];
