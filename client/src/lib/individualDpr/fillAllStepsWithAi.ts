import { AISuggestionsService } from '@/services/aiSuggestions.service';
import { extraFieldsForScheme, VISHWAKARMA_CRAFTS, hideComplexCapex } from '@/lib/individualDpr/schemeFormConfig';
import { getSchemeSteps } from '@/lib/individualDpr/schemeStepCatalog';
import { getIndividualDocFields, isLeanUnitScheme } from '@/lib/individualDpr/individualDocModel';
import { suggestionToFieldValue, isNumericDprField, isStructuredDprField, toDateInputValue } from '@/lib/dprAiFieldNormalize';
import { mergeCmepProjectedSuggestion } from '@/lib/individualDpr/cmepProjections';
import { machineryTotalLakhs, totalsFromCostPhasing, workingCapitalFromBuildup } from '@/lib/individualDpr/cmepBankPack';
import { groundCostSuggestion } from '@/lib/individualDpr/costSuggestionGuard';
import { Budget, VentureMatchAnswers } from '@/lib/ventureMatch/types';

const IDENTITY_FIELDS = ['clusterName', 'unitName', 'district', 'location'];

function matchCraft(value: string): string {
  const text = String(value || '').toLowerCase();
  const exact = VISHWAKARMA_CRAFTS.find((c) => c.toLowerCase() === text);
  if (exact) return exact;
  const partial = VISHWAKARMA_CRAFTS.find(
    (c) => text.includes(c.toLowerCase()) || c.toLowerCase().includes(text)
  );
  return partial || VISHWAKARMA_CRAFTS[0];
}

export function normalizeExtraValue(field: string, value: any): any {
  if (Array.isArray(value)) {
    value = value.filter(Boolean).join(', ');
  }
  const text = String(value ?? '').trim();
  if (!text) return '';
  if (field === 'craft') return matchCraft(text);
  if (field === 'covOrLor') return /lor/i.test(text) ? 'lor' : 'cov';
  if (field === 'fssai') return /plan/i.test(text) ? 'planned' : 'yes';
  if (field === 'unitStage') return /exist|upgrade|expans/i.test(text) ? 'existing' : 'new';
  if (field === 'odopAligned') return /\bno\b|non-?odop/i.test(text) ? 'no' : /yes|odop/i.test(text) ? 'yes' : text;
  if (field === 'priorScheme') {
    if (/regp/i.test(text)) return 'REGP';
    if (/mudra/i.test(text)) return 'MUDRA';
    return 'PMEGP';
  }
  if (field === 'marginMoneyAdjusted' || field === 'firstLoanRepaid' || field === 'nerHill') {
    return /\bno\b/i.test(text) ? 'no' : 'yes';
  }
  if (field === 'sectorBand') return /service|trad|business/i.test(text) ? 'service' : 'manufacturing';
  if (field === 'sclcssCategory') return /st\b|tribe/i.test(text) ? 'st' : 'sc';
  if (field === 'enterpriseSize') {
    if (/medium/i.test(text)) return 'medium';
    if (/small/i.test(text)) return 'small';
    return 'micro';
  }
  if (field === 'specialCategory' || field === 'apDomicile' || field === 'scStOwned') {
    return /\bno\b/i.test(text) ? 'no' : 'yes';
  }
  if (field === 'priorSelfEmploymentLoan') {
    return /\byes\b|availed|taken/i.test(text) ? 'yes' : 'no';
  }
  if (field === 'trainingStage') {
    if (/advanced/i.test(text)) return 'advancedDone';
    if (/basic|complet/i.test(text)) return 'basicDone';
    return 'notStarted';
  }
  if (field === 'loanTranche') {
    if (/third|3rd|₹?\s*50/i.test(text)) return 'third';
    if (/second|2nd|₹?\s*25|₹?\s*2\s*l/i.test(text)) return 'second';
    if (/none|not yet|await/i.test(text)) return 'noneYet';
    if (/first|1st|₹?\s*15|₹?\s*1\s*l/i.test(text)) return 'first';
    return 'first';
  }
  if (field === 'vendingType') {
    if (/cart|thela/i.test(text)) return 'cart';
    if (/stall|kiosk/i.test(text)) return 'stall';
    if (/market/i.test(text)) return 'market';
    if (/mov|hawk|door/i.test(text)) return 'moving';
    if (/other/i.test(text)) return 'other';
    return 'footpath';
  }
  if (field === 'workplaceType') {
    if (/rent/i.test(text)) return 'rentedShop';
    if (/own|shed/i.test(text)) return 'ownShop';
    if (/cart|stall|foot|market|mov/i.test(text)) {
      if (/cart|thela/i.test(text)) return 'cart';
      if (/stall/i.test(text)) return 'stall';
      if (/market/i.test(text)) return 'market';
      if (/mov|hawk/i.test(text)) return 'moving';
      return 'footpath';
    }
    if (/other/i.test(text)) return 'other';
    return 'home';
  }
  if (field === 'accountStatus') {
    if (/sma/i.test(text)) return 'sma1';
    if (/other|npa|inelig/i.test(text)) return 'other';
    return 'standard';
  }
  if (field === 'zedCurrentLevel' || field === 'zedTargetLevel') {
    if (/gold/i.test(text)) return 'gold';
    if (/silver/i.test(text)) return 'silver';
    if (/bronze/i.test(text)) return 'bronze';
    return 'none';
  }
  if (field === 'ipType') {
    if (/design/i.test(text)) return 'design';
    if (/trade|mark|brand/i.test(text)) return 'trademark';
    if (/\bgi\b|geograph/i.test(text)) return 'gi';
    if (/other/i.test(text)) return 'other';
    return 'patent';
  }
  if (field === 'filingStage') {
    if (/grant|regist/i.test(text)) return 'granted';
    if (/filed|applic/i.test(text)) return 'filed';
    if (/draft/i.test(text)) return 'draft';
    return 'idea';
  }
  if (field === 'gemExperience') {
    if (/won|order/i.test(text)) return 'won';
    if (/bid/i.test(text)) return 'bidding';
    if (/regist/i.test(text)) return 'registered';
    return 'none';
  }
  if (field === 'loomType') {
    if (/jacquard|semi/i.test(text)) return 'jacquard';
    if (/pit/i.test(text)) return 'pit';
    if (/other/i.test(text)) return 'other';
    return 'frame';
  }
  if (field === 'apiicPark') return /yes|apiic|park/i.test(text) && !/\bno\b/i.test(text) ? 'yes' : /no/i.test(text) ? 'no' : 'yes';
  return text;
}

function inferMissingExtras(
  schemeCode: string | null,
  step1: Record<string, any>,
  extras: Record<string, any>
): Record<string, any> {
  const next = { ...extras };
  const hint = [step1.unitName || step1.clusterName, step1.natureOfBusiness, step1.majorProducts, extras.craft]
    .filter(Boolean)
    .join(' ');
  if (schemeCode === 'VISHWAKARMA') {
    const craft = next.craft || matchCraft(hint);
    next.craft = craft;
    if (!next.currentTools) {
      next.currentTools = `Existing ${craft.toLowerCase()} hand tools and workshop equipment used in day-to-day work.`;
    }
    if (!next.newTools) {
      next.newTools = `Upgraded ${craft.toLowerCase()} tools and kit items to be bought with the ₹15,000 PM Vishwakarma toolkit voucher.`;
    }
    if (!next.trainingStage) next.trainingStage = 'notStarted';
    if (!next.loanTranche) next.loanTranche = 'noneYet';
    if (!next.priorSelfEmploymentLoan) next.priorSelfEmploymentLoan = 'no';
    if (!next.workplaceType) next.workplaceType = 'home';
  }
  if (schemeCode === 'SVANIDHI') {
    if (!next.covOrLor) next.covOrLor = 'cov';
    if (!next.upiQr) next.upiQr = 'UPI ID to be linked to the vendor savings bank account.';
    if (!next.loanTranche) next.loanTranche = 'first';
    if (!next.vendingType) next.vendingType = 'footpath';
    if (!next.workplaceType) next.workplaceType = next.vendingType;
  }
  if (schemeCode === 'PMFME') {
    if (!next.fssai) next.fssai = 'planned';
    if (!next.unitStage) next.unitStage = /exist|upgrade|expans/i.test(hint) ? 'existing' : 'new';
    if (!next.odopAligned) next.odopAligned = 'yes';
  }
  if (schemeCode === 'PMEGP_2ND') {
    if (!next.priorScheme) next.priorScheme = /mudra/i.test(hint) ? 'MUDRA' : /regp/i.test(hint) ? 'REGP' : 'PMEGP';
    if (!next.marginMoneyAdjusted) next.marginMoneyAdjusted = 'yes';
    if (!next.firstLoanRepaid) next.firstLoanRepaid = 'yes';
    if (!next.nerHill) next.nerHill = 'no';
    if (!next.sectorBand) next.sectorBand = /service|trad|shop/i.test(hint) ? 'service' : 'manufacturing';
    if (!next.pmegpAgency) next.pmegpAgency = 'DIC';
  }
  if (schemeCode === 'SCLCSS') {
    if (!next.sclcssCategory) next.sclcssCategory = /st\b|tribe/i.test(hint) ? 'st' : 'sc';
    if (!next.unitStage) next.unitStage = /new|greenfield|first/i.test(hint) ? 'new' : 'existing';
    if (!next.controllingStakePercent) next.controllingStakePercent = '51';
    if (!next.udyamStatus) next.udyamStatus = 'Udyam ready / applied';
  }
  if (schemeCode === 'AP_TECH_UPGRADE') {
    if (!next.enterpriseSize) {
      next.enterpriseSize = /medium/i.test(hint) ? 'medium' : /small/i.test(hint) ? 'small' : 'micro';
    }
    if (!next.specialCategory) {
      next.specialCategory = /woman|sc|st|bc|pwd|transgender|minority/i.test(hint) ? 'yes' : 'no';
    }
    if (!next.apDomicile) next.apDomicile = 'yes';
  }
  if (schemeCode === 'AP_EDP') {
    if (!next.enterpriseSize) {
      next.enterpriseSize = /medium/i.test(hint) ? 'medium' : /small/i.test(hint) ? 'small' : 'micro';
    }
    if (!next.specialCategory) {
      next.specialCategory = /woman|sc|st|bc|pwd|transgender|minority/i.test(hint) ? 'yes' : 'no';
    }
    if (!next.scStOwned) next.scStOwned = /\bsc\b|\bst\b|tribe|scheduled/i.test(hint) ? 'yes' : 'no';
    if (!next.apDomicile) next.apDomicile = 'yes';
    if (!next.apiicPark) {
      next.apiicPark = /apiic|industrial park/i.test(hint) ? 'yes' : 'no';
    }
  }
  if (schemeCode === 'ECLGS') {
    if (!next.accountStatus) next.accountStatus = 'standard';
    if (!next.additionalWcSought && next.peakWcOutstanding) {
      next.additionalWcSought = String(
        Math.round(((Number(next.peakWcOutstanding) || 0) * 20) / 100)
      );
    }
  }
  if (schemeCode === 'ZED') {
    if (!next.zedCurrentLevel) next.zedCurrentLevel = 'none';
    if (!next.zedTargetLevel) next.zedTargetLevel = 'bronze';
  }
  if (schemeCode === 'LEAN' && !next.processBottleneck) {
    next.processBottleneck = 'Primary shop-floor bottleneck to be diagnosed with the LEAN consultant.';
  }
  if (schemeCode === 'MSME_IPR') {
    if (!next.ipType) next.ipType = /trade|mark|brand/i.test(hint) ? 'trademark' : 'patent';
    if (!next.filingStage) next.filingStage = 'idea';
  }
  if (schemeCode === 'PMS' && !next.eventName) {
    next.eventName = 'Domestic trade fair / exhibition (to be confirmed)';
  }
  if (schemeCode === 'SCST_HUB') {
    if (!next.sclcssCategory) next.sclcssCategory = /st\b|tribe/i.test(hint) ? 'st' : 'sc';
    if (!next.gemExperience) next.gemExperience = 'none';
  }
  if (schemeCode === 'ASPIRE' && !next.incubatorName) {
    next.incubatorName = 'ASPIRE LBI / incubator (to be named)';
  }
  if (schemeCode === 'NHDP') {
    if (!next.loomType) next.loomType = 'frame';
    if (!next.weaverId) next.weaverId = 'Weaver ID / handloom corp membership to be filled';
  }
  if (schemeCode === 'CVY') {
    if (!next.coirBoardStatus) next.coirBoardStatus = 'applied';
    if (!next.coirProductLine) next.coirProductLine = 'Coir fibre / products (to be specified)';
  }
  if (schemeCode === 'MSE_GIFT') {
    if (!next.expectedSaving) next.expectedSaving = '15';
    if (!next.eeEquipment) next.eeEquipment = 'Energy-efficient process / utility equipment';
  }
  if (schemeCode === 'PTUAS') {
    if (!next.gmpStatus) next.gmpStatus = 'partial';
  }
  if (schemeCode === 'PMPDS' && !next.deviceOrFormulation) {
    next.deviceOrFormulation = /device/i.test(hint) ? 'device' : 'formulation';
  }
  if (schemeCode === 'CGTMSE') {
    if (!next.loanPurpose) next.loanPurpose = 'composite';
    if (!next.womenOwned) next.womenOwned = /woman|women/i.test(hint) ? 'yes' : 'no';
  }
  if (schemeCode === 'AP_FPP') {
    if (!next.enterpriseSize) {
      next.enterpriseSize = /medium/i.test(hint) ? 'medium' : /small/i.test(hint) ? 'small' : 'micro';
    }
    if (!next.specialCategory) {
      next.specialCategory = /woman|sc|st|bc|pwd|fpo|shg/i.test(hint) ? 'yes' : 'no';
    }
    if (!next.apDomicile) next.apDomicile = 'yes';
    if (!next.fpoShg) next.fpoShg = /fpo|shg/i.test(hint) ? 'yes' : 'no';
  }
  if (schemeCode === 'AP_CMEP') {
    if (!next.activityBand) {
      next.activityBand = /knowledge|service|it\b|software/i.test(hint) ? 'knowledge' : 'manufacturing';
    }
    if (!next.boosterCategory) {
      next.boosterCategory = /woman/i.test(hint)
        ? 'woman'
        : /pwd|disabled/i.test(hint)
          ? 'pwd'
          : /ex[- ]?service/i.test(hint)
            ? 'exServiceman'
            : /transgender/i.test(hint)
              ? 'transgender'
              : 'none';
    }
    if (!next.apDomicile) next.apDomicile = 'yes';
  }
  if (schemeCode === 'OBMMS') {
    if (!next.welfareCorporation) {
      next.welfareCorporation = /\bst\b|tribe/i.test(hint)
        ? 'st'
        : /\bbc\b/i.test(hint)
          ? 'bc'
          : /kapu/i.test(hint)
            ? 'kapu'
            : /minority/i.test(hint)
              ? 'minority'
              : 'sc';
    }
    if (!next.whiteRiceCard) next.whiteRiceCard = 'yes';
  }
  if (schemeCode === 'MSE_SPICE') {
    if (!next.circularSector) {
      next.circularSector = /e-?waste/i.test(hint)
        ? 'ewaste'
        : /textile/i.test(hint)
          ? 'textile'
          : /plastic/i.test(hint)
            ? 'plastic'
            : 'other';
    }
  }
  if (schemeCode === 'AP_PARKS') {
    if (!next.landRebateClaim) {
      next.landRebateClaim = /woman/i.test(hint) ? 'women' : /\bsc\b|\bst\b/i.test(hint) ? 'scSt' : 'general';
    }
    if (!next.apDomicile) next.apDomicile = 'yes';
  }
  if (schemeCode === 'RAMP_TEAM' && !next.ondcReady) {
    next.ondcReady = 'planning';
  }
  if (schemeCode === 'EPM_NIRYAT') {
    if (!next.prePostShipment) next.prePostShipment = 'both';
    if (!next.exportMarkets) next.exportMarkets = 'Export markets to be confirmed';
  }
  return next;
}

export type FillAllProgress = {
  step: number;
  index: number;
  total: number;
};

export type FillAllResult = {
  filledSteps: number[];
  failedSteps: number[];
};

export type FillStepProgress = {
  field: string;
  label: string;
  index: number;
  total: number;
};

export type FillStepResult = {
  filled: string[];
  failed: string[];
};

export type StepFieldSuggestion = {
  field: string;
  label: string;
  suggestion: string;
  source: 'step' | 'extras';
};

export type SuggestStepResult = {
  suggestions: StepFieldSuggestion[];
  failed: string[];
};

function buildStepSuggestContext(options: {
  contentStep: number;
  data: Record<string, any>;
  getStepData: (step: number) => any;
  schemeCode: string | null;
  answers?: VentureMatchAnswers | null;
  excludeFields?: string[];
}) {
  const { contentStep, getStepData, schemeCode, answers } = options;
  const data = { ...options.data };
  const budget = answers?.budget;
  const exclude = [
    ...excludeForStep(contentStep, schemeCode, budget),
    ...(options.excludeFields || []),
  ];
  const excludeSet = new Set(exclude);
  const extraFieldNames = extraFieldsForScheme(schemeCode);
  const catalogFields = getIndividualDocFields(contentStep, schemeCode, budget).filter(
    (f) => !excludeSet.has(f.name) && !IDENTITY_FIELDS.includes(f.name)
  );

  const schemeSteps = getSchemeSteps(schemeCode);
  const currentLocal = schemeSteps.find((s) => s.contentStep === contentStep)?.n ?? contentStep;
  const priorContent = schemeSteps
    .filter((s) => s.n < currentLocal)
    .map((s) => s.contentStep);
  const previous = previousStepsPayload(data, priorContent, schemeCode, budget);

  let stepData = { ...(getStepData(contentStep) || data[`step${contentStep}`] || {}) };
  if (contentStep === 1 || extraFieldNames.length) {
    stepData = { ...(data.schemeExtras || {}), ...stepData };
  }

  return { catalogFields, previous, stepData, extraFieldNames, exclude, budget };
}

/**
 * Fetch AI suggestions for this step's catalog questions only — does not write to the form.
 * One API call per field so the model cannot invent keys from other steps.
 */
export async function suggestCurrentStepWithAi(options: {
  contentStep: number;
  data: Record<string, any>;
  getStepData: (step: number) => any;
  schemeCode: string | null;
  answers?: VentureMatchAnswers | null;
  excludeFields?: string[];
  onProgress?: (progress: FillStepProgress) => void;
}): Promise<SuggestStepResult> {
  const { contentStep, onProgress } = options;
  const ctx = buildStepSuggestContext(options);
  const { catalogFields, previous, stepData, exclude } = ctx;

  if (!catalogFields.length) {
    return { suggestions: [], failed: [] };
  }

  const suggestions: StepFieldSuggestion[] = [];
  const failed: string[] = [];

  for (let i = 0; i < catalogFields.length; i++) {
    const fieldDef = catalogFields[i];
    const field = fieldDef.name;
    onProgress?.({
      field,
      label: fieldDef.label,
      index: i + 1,
      total: catalogFields.length,
    });

    const otherExcludes = catalogFields
      .map((f) => f.name)
      .filter((name) => name !== field)
      .concat(exclude);

    try {
      let previousForField = previous;
      if (isNumericDprField(field)) {
        const plainNumber = [
          'interestRate',
          'moratoriumMonths',
          'loanTenureMonths',
          'subsidyPercent',
          'capacityPerDay',
          'workingDays',
          'capacityUtilisation',
          'sellingPricePerUnit',
          'monthlyRent',
          'monthlySalaries',
          'monthlyPower',
          'annualExpenseGrowth',
          'loomCount',
          'shifts',
          'workshopAreaSqft',
          'productionAreaSqft',
          'storageAreaSqft',
          'officeAreaSqft',
          'leaseYears',
          'wcRawStock',
          'wcWip',
          'wcFinished',
          'wcReceivables',
          'wcSupplierCredit',
          'wcCash',
        ].includes(field);
        previousForField = {
          ...previous,
          _promptContext: plainNumber
            ? `For field "${field}" ("${fieldDef.label}"): reply with ONLY a number. No words and no extra fields.`
            : `For field "${field}" ("${fieldDef.label}"): reply with ONLY a number in ₹ Lakhs already stated in the previous steps. If no amount was stated, reply 0. Do not invent a project cost. No words and no currency symbol.`,
        };
      } else if (field === 'yearProjections') {
        const yearPrompt = options.schemeCode === 'AP_CMEP'
          ? `For field "yearProjections": reply with ONLY a JSON array of 8 objects for the next 8 financial years, values in ₹ Lakhs. Keys: year, sales, rm, wages, power, salaries, rent, maintenance, admin, interest, depreciation, tax, netProfit. Do not add previous-year columns and do not add any other field.`
          : `For field "yearProjections": reply with ONLY a JSON array of 5 objects, values in ₹ Lakhs (not rupees). Example: [{"year":1,"sales":18,"rm":8,"wages":3,"power":1.5,"netProfit":4},{"year":2,"sales":20,"rm":9,"wages":3.2,"power":1.6,"netProfit":4.5},{"year":3,"sales":22,"rm":10,"wages":3.5,"power":1.7,"netProfit":5},{"year":4,"sales":24,"rm":11,"wages":3.8,"power":1.8,"netProfit":5.5},{"year":5,"sales":26,"rm":12,"wages":4,"power":2,"netProfit":6}]. Fill sales, rm, wages, power, and netProfit for EVERY year. No prose.`;
        previousForField = {
          ...previous,
          _promptContext: yearPrompt,
        };
      } else if (
        (field === 'promoters' || field === 'costPhasing') && options.schemeCode === 'AP_CMEP' ||
        field === 'machineryItems' ||
        field === 'productMix' ||
        field === 'rawMaterialItems' ||
        field === 'staffRoles' ||
        field === 'risks' ||
        field === 'utilisationByYear'
      ) {
        const shape = field === 'promoters'
          ? '[{"name":"","relationName":"","age":"","dob":"","education":"","experienceYears":"","phone":"","address":""}]'
          : field === 'machineryItems'
            ? options.schemeCode === 'AP_CMEP'
              ? '[{"description":"","condition":"new","supplier":"","quantity":1,"unitCost":0,"gst":0,"transport":0,"installation":0,"lifeYears":0,"annualMaintenance":0}]'
              : '[{"description":"","condition":"new","supplier":"","quantity":1,"unitCost":0}]'
            : field === 'productMix'
              ? '[{"name":"","sharePercent":0,"sellingPrice":0}]'
              : field === 'rawMaterialItems'
                ? '[{"name":"","use":"","basis":""}]'
                : field === 'staffRoles'
                  ? '[{"role":"","count":0,"monthlyPay":0}]'
                  : field === 'risks'
                    ? '[{"risk":"","mitigation":""}]'
                    : field === 'utilisationByYear'
                      ? '[{"label":"2026-2027","percent":60}]'
            : '{"land":{"incurred":0,"proposed":0},"building":{"incurred":0,"proposed":0},"machinery":{"incurred":0,"proposed":0},"furniture":{"incurred":0,"proposed":0},"deposits":{"incurred":0,"proposed":0},"workingCapital":{"incurred":0,"proposed":0}}';
        previousForField = {
          ...previous,
          _promptContext: `For field "${field}": reply with ONLY JSON in this shape: ${shape}. Do not add any other question or key.`,
        };
      } else if (field === 'milestones') {
        previousForField = {
          ...previous,
          _promptContext: `For field "milestones": reply with ONLY a JSON array of 3–5 objects. Example: [{"activity":"Machinery order / installation","timeRequired":"30 days","startDate":"2026-04-01","endDate":"2026-04-30"},{"activity":"Power connection","timeRequired":"15 days","startDate":"2026-05-01","endDate":"2026-05-15"},{"activity":"Trial run / commercial production","timeRequired":"15 days","startDate":"2026-05-16","endDate":"2026-05-31"}]. Dates must be YYYY-MM-DD. No prose.`,
        };
      } else if (
        field === 'startDate' ||
        field === 'endDate' ||
        field === 'commitmentDate' ||
        (field === 'yearOfEstablishment' && isLeanUnitScheme(options.schemeCode))
      ) {
        previousForField = {
          ...previous,
          _promptContext: `For field "${field}": reply with ONLY a date in YYYY-MM-DD format (e.g. 2026-06-01). No words.`,
        };
      } else if (field === 'employmentGeneration' || field === 'indirectEmployment') {
        previousForField = {
          ...previous,
          _promptContext: `For field "${field}" ("${fieldDef.label}"): reply with ONLY a whole number (headcount), e.g. 4. No words.`,
        };
      } else if (
        ['executiveSummary', 'processOfManufacture', 'sectorDescription', 'presentActivities', 'targetMarket', 'existingDemand', 'geography', 'landDetails', 'impactNote', 'waterAndEffluent'].includes(field)
      ) {
        previousForField = {
          ...previous,
          _promptContext: `For field "${field}" ("${fieldDef.label}"): write 320 to 450 words of finished bank-ready prose for this one field only. Do not invent extra questions or headings.`,
        };
      }
      const aiSuggestions = await AISuggestionsService.getSuggestionsForStep(
        contentStep,
        stepData,
        previousForField,
        otherExcludes
      );
      const match = (aiSuggestions || []).find((s) => s.field === field);
      if (!match) {
        failed.push(field);
        continue;
      }
      const text =
        typeof match.suggestion === 'string'
          ? match.suggestion
          : JSON.stringify(match.suggestion);
      if (!String(text || '').trim()) {
        failed.push(field);
        continue;
      }
      suggestions.push({
        field,
        label: fieldDef.label,
        suggestion: groundCostSuggestion(field, String(text).trim(), previous),
        source: fieldDef.source === 'extras' ? 'extras' : 'step',
      });
    } catch (error) {
      console.error(`AI suggest failed for ${field} on content step ${contentStep}:`, error);
      failed.push(field);
    }
  }

  return { suggestions, failed };
}

/**
 * Regenerate one catalog field suggestion using optional user "add these points" instructions.
 */
export async function regenerateStepFieldSuggestion(options: {
  contentStep: number;
  field: string;
  label: string;
  source?: 'step' | 'extras';
  instruction: string;
  currentSuggestion?: string;
  data: Record<string, any>;
  getStepData: (step: number) => any;
  schemeCode: string | null;
  answers?: VentureMatchAnswers | null;
  excludeFields?: string[];
}): Promise<StepFieldSuggestion | null> {
  const {
    contentStep,
    field,
    label,
    instruction,
    currentSuggestion,
  } = options;
  const ctx = buildStepSuggestContext(options);
  const { catalogFields, previous, stepData, exclude } = ctx;
  const fieldDef = catalogFields.find((f) => f.name === field);
  if (!fieldDef) return null;

  const otherExcludes = catalogFields
    .map((f) => f.name)
    .filter((name) => name !== field)
    .concat(exclude);

  const promptParts = [
    `Regenerate ONLY the suggestion for field "${field}" ("${label}").`,
    instruction.trim()
      ? `The user wants these points included or reflected:\n${instruction.trim()}`
      : 'Produce a fresh alternative suggestion for this field.',
    currentSuggestion?.trim()
      ? `Previous suggestion to improve upon:\n"""\n${currentSuggestion.trim()}\n"""`
      : '',
  ].filter(Boolean);

  const previousWithHint = {
    ...previous,
    _promptContext: promptParts.join('\n\n'),
  };

  const aiSuggestions = await AISuggestionsService.getSuggestionsForStep(
    contentStep,
    stepData,
    previousWithHint,
    otherExcludes
  );
  const match = (aiSuggestions || []).find((s) => s.field === field);
  if (!match) return null;
  const text =
    typeof match.suggestion === 'string'
      ? match.suggestion
      : JSON.stringify(match.suggestion);
  if (!String(text || '').trim()) return null;

  return {
    field,
    label: fieldDef.label || label,
    suggestion: String(text).trim(),
    source: options.source || (fieldDef.source === 'extras' ? 'extras' : 'step'),
  };
}

/**
 * Apply one catalog suggestion into step data or scheme extras (Latest DPR).
 * Returns the normalized value written (or null if skipped).
 */
export function applyCatalogSuggestionToForm(options: {
  contentStep: number;
  suggestion: StepFieldSuggestion;
  getStepData: (step: number) => any;
  setStepData: (step: number, stepData: any) => void;
  setSchemeExtras?: (extras: Record<string, any>) => void;
  schemeExtras?: Record<string, any>;
  schemeCode: string | null;
  /** When applying many fields, pass a shared mutable bag so we don't lose prior writes. */
  stepPatch?: Record<string, any>;
}): { ok: boolean; value: any } {
  const {
    contentStep,
    suggestion,
    getStepData,
    setStepData,
    setSchemeExtras,
    schemeCode,
    stepPatch,
  } = options;
  const extraFieldNames = extraFieldsForScheme(schemeCode);
  let value = suggestionToFieldValue(suggestion.field, suggestion.suggestion);
  if (schemeCode === 'AP_CMEP' && suggestion.field === 'yearProjections' && Array.isArray(value)) {
    const current = stepPatch?.yearProjections ?? getStepData(contentStep)?.yearProjections;
    value = mergeCmepProjectedSuggestion(current, value);
  }

  // Structured / date fields must parse cleanly — never store raw AI prose.
  if (isStructuredDprField(suggestion.field)) {
    if (suggestion.field === 'costPhasing') {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return { ok: false, value: null };
    } else if (!Array.isArray(value) || value.length === 0) return { ok: false, value: null };
  } else if (
    suggestion.field === 'startDate' ||
    suggestion.field === 'endDate' ||
    suggestion.field === 'commitmentDate' ||
    (suggestion.field === 'yearOfEstablishment' && isLeanUnitScheme(schemeCode))
  ) {
    value = toDateInputValue(value) || toDateInputValue(suggestion.suggestion);
    if (!value) return { ok: false, value: null };
  } else if (isNumericDprField(suggestion.field)) {
    // Never store prose in ₹ Lakhs / numeric buckets — that breaks totals via string concat.
    if (value === null || value === undefined || value === '') {
      return { ok: false, value: null };
    }
    value = Number(value);
    if (!Number.isFinite(value)) return { ok: false, value: null };
  } else if (value === null || value === undefined || value === '') {
    value = String(suggestion.suggestion || '').trim();
  }
  if (value === null || value === undefined || value === '') return { ok: false, value: null };

  if (suggestion.source === 'extras' || extraFieldNames.includes(suggestion.field)) {
    if (!setSchemeExtras) return { ok: false, value: null };
    const next = {
      ...(options.schemeExtras || {}),
      [suggestion.field]: normalizeExtraValue(suggestion.field, value),
    };
    setSchemeExtras(next);
    return { ok: true, value: next[suggestion.field] };
  }

  // PMEGP family: keep directEmployment extras in sync with employmentGeneration
  if (
    suggestion.field === 'employmentGeneration' &&
    setSchemeExtras &&
    (schemeCode === 'PMEGP' || schemeCode === 'PMEGP_2ND' || schemeCode === 'PMFME')
  ) {
    const nextExtras = {
      ...(options.schemeExtras || {}),
      directEmployment: String(value),
    };
    setSchemeExtras(nextExtras);
  }

  if (stepPatch) {
    stepPatch[suggestion.field] = value;
    if (suggestion.field === 'costPhasing' && value && typeof value === 'object') {
      Object.assign(stepPatch, totalsFromCostPhasing(value as Record<string, { incurred: number; proposed: number }>));
    }
    if (suggestion.field === 'machineryItems' && Array.isArray(value)) {
      stepPatch.machinery = machineryTotalLakhs(value, schemeCode === 'AP_CMEP');
    }
    if (String(suggestion.field).startsWith('wc')) {
      stepPatch.workingCapitalMargin = workingCapitalFromBuildup({ ...stepPatch });
    }
    return { ok: true, value };
  }

  const latest = { ...(getStepData(contentStep) || {}) };
  latest[suggestion.field] = value;
  if (suggestion.field === 'costPhasing' && value && typeof value === 'object') {
    Object.assign(latest, totalsFromCostPhasing(value as Record<string, { incurred: number; proposed: number }>));
  }
  if (suggestion.field === 'machineryItems' && Array.isArray(value)) {
    latest.machinery = machineryTotalLakhs(value, schemeCode === 'AP_CMEP');
  }
  if (String(suggestion.field).startsWith('wc')) {
    latest.workingCapitalMargin = workingCapitalFromBuildup(latest);
  }
  extraFieldNames.forEach((name) => {
    delete latest[name];
  });
  setStepData(contentStep, latest);
  return { ok: true, value };
}

/**
 * Apply many catalog suggestions in one step write (avoids lost updates).
 */
export function applyAllCatalogSuggestionsToForm(options: {
  contentStep: number;
  suggestions: StepFieldSuggestion[];
  getStepData: (step: number) => any;
  setStepData: (step: number, stepData: any) => void;
  setSchemeExtras?: (extras: Record<string, any>) => void;
  schemeExtras?: Record<string, any>;
  schemeCode: string | null;
}): { applied: number; values: Record<string, any> } {
  const {
    contentStep,
    suggestions,
    getStepData,
    setStepData,
    setSchemeExtras,
    schemeCode,
  } = options;
  const extraFieldNames = extraFieldsForScheme(schemeCode);
  let extras = { ...(options.schemeExtras || {}) };
  const stepPatch: Record<string, any> = {};
  const values: Record<string, any> = {};
  let applied = 0;

  for (const suggestion of suggestions) {
    const result = applyCatalogSuggestionToForm({
      contentStep,
      suggestion,
      getStepData,
      setStepData: () => {},
      setSchemeExtras: (next) => {
        extras = next;
      },
      schemeExtras: extras,
      schemeCode,
      stepPatch,
    });
    if (result.ok) {
      applied += 1;
      values[suggestion.field] = result.value;
    }
  }

  if (Object.keys(stepPatch).length) {
    const latest = { ...(getStepData(contentStep) || {}), ...stepPatch };
    extraFieldNames.forEach((name) => {
      delete latest[name];
    });
    setStepData(contentStep, latest);
  }
  if (setSchemeExtras && Object.keys(extras).length) {
    setSchemeExtras(extras);
  }

  return { applied, values };
}

/**
 * Fill only the current scheme step's catalog questions (getIndividualDocFields),
 * one field at a time. Does not touch other steps.
 */
export async function fillCurrentStepWithAi(options: {
  contentStep: number;
  data: Record<string, any>;
  setStepData: (step: number, stepData: any) => void;
  getStepData: (step: number) => any;
  setSchemeExtras?: (extras: Record<string, any>) => void;
  schemeCode: string | null;
  answers?: VentureMatchAnswers | null;
  excludeFields?: string[];
  onProgress?: (progress: FillStepProgress) => void;
}): Promise<FillStepResult> {
  const {
    contentStep,
    setStepData,
    getStepData,
    setSchemeExtras,
    schemeCode,
    answers,
    onProgress,
  } = options;
  let data = { ...options.data };
  const budget = answers?.budget;
  const exclude = [
    ...excludeForStep(contentStep, schemeCode, budget),
    ...(options.excludeFields || []),
  ];
  const excludeSet = new Set(exclude);
  const extraFieldNames = extraFieldsForScheme(schemeCode);
  let extras = { ...(data.schemeExtras || {}) };

  const catalogFields = getIndividualDocFields(contentStep, schemeCode, budget).filter(
    (f) => !excludeSet.has(f.name) && !IDENTITY_FIELDS.includes(f.name)
  );

  if (!catalogFields.length) {
    return { filled: [], failed: [] };
  }

  const schemeSteps = getSchemeSteps(schemeCode);
  const currentLocal = schemeSteps.find((s) => s.contentStep === contentStep)?.n ?? contentStep;
  const priorContent = schemeSteps
    .filter((s) => s.n < currentLocal)
    .map((s) => s.contentStep);
  const previous = previousStepsPayload(data, priorContent, schemeCode, budget);

  let stepData = { ...(getStepData(contentStep) || data[`step${contentStep}`] || {}) };
  // Give the model visibility into scheme extras already on the form
  if (contentStep === 1 || extraFieldNames.length) {
    stepData = { ...extras, ...stepData };
  }
  const filled: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < catalogFields.length; i++) {
    const fieldDef = catalogFields[i];
    const field = fieldDef.name;
    onProgress?.({
      field,
      label: fieldDef.label,
      index: i + 1,
      total: catalogFields.length,
    });

    const otherExcludes = catalogFields
      .map((f) => f.name)
      .filter((name) => name !== field)
      .concat(exclude);

    try {
      const suggestions = await AISuggestionsService.getSuggestionsForStep(
        contentStep,
        stepData,
        previous,
        otherExcludes
      );
      const match = (suggestions || []).find((s) => s.field === field);
      if (!match) {
        failed.push(field);
        continue;
      }

      const text =
        typeof match.suggestion === 'string'
          ? match.suggestion
          : JSON.stringify(match.suggestion);
      let value = suggestionToFieldValue(field, text);
      if (schemeCode === 'AP_CMEP' && field === 'yearProjections' && Array.isArray(value)) {
        value = mergeCmepProjectedSuggestion(stepData?.yearProjections, value);
      }
      if (value === null || value === undefined || value === '') {
        failed.push(field);
        continue;
      }

      if (fieldDef.source === 'extras' || extraFieldNames.includes(field)) {
        value = normalizeExtraValue(field, value);
        extras = { ...extras, [field]: value };
        if (setSchemeExtras) setSchemeExtras(extras);
        data = { ...data, schemeExtras: extras };
        stepData = { ...stepData, [field]: value };
        filled.push(field);
        continue;
      }

      stepData = { ...stepData, [field]: value };
      // Persist only store step fields (strip extras keys from step bucket)
      const persistStep = { ...stepData };
      extraFieldNames.forEach((name) => {
        delete persistStep[name];
      });
      setStepData(contentStep, persistStep);
      data = { ...data, [`step${contentStep}`]: persistStep };
      filled.push(field);
    } catch (error) {
      console.error(`AI fill failed for ${field} on content step ${contentStep}:`, error);
      failed.push(field);
    }
  }

  if (contentStep === 1 && extraFieldNames.length && setSchemeExtras) {
    extras = inferMissingExtras(schemeCode, stepData, extras);
    setSchemeExtras(extras);
  }

  return { filled, failed };
}

function excludeForStep(
  contentStep: number,
  schemeCode: string | null,
  budget?: Budget
): string[] {
  if (contentStep === 1) return [...IDENTITY_FIELDS];
  if (contentStep === 12 && hideComplexCapex(schemeCode, budget)) {
    return ['land', 'building', 'utilitiesAndInfrastructure', 'preliminaryAndPreOperative'];
  }
  return [];
}

function previousStepsPayload(
  data: Record<string, any>,
  beforeContentSteps: number[],
  schemeCode: string | null,
  budget?: string | null
) {
  const previous: Record<string, any> = {
    _isIndividualDPR: true,
    ...(schemeCode ? { _schemeCode: schemeCode } : {}),
    ...(budget ? { _budget: budget } : {}),
  };
  for (const contentStep of beforeContentSteps) {
    const key = `step${contentStep}`;
    if (data[key] && typeof data[key] === 'object') previous[key] = data[key];
  }
  return previous;
}

export async function fillAllStepsWithAi(options: {
  data: Record<string, any>;
  setStepData: (step: number, stepData: any) => void;
  getStepData: (step: number) => any;
  setSchemeExtras?: (extras: Record<string, any>) => void;
  schemeCode: string | null;
  answers?: VentureMatchAnswers | null;
  onProgress?: (progress: FillAllProgress) => void;
}): Promise<FillAllResult> {
  const { setStepData, getStepData, setSchemeExtras, schemeCode, answers, onProgress } = options;
  let data = { ...options.data };
  const extraFieldNames = extraFieldsForScheme(schemeCode);
  let extras = { ...(data.schemeExtras || {}) };
  extraFieldNames.forEach((field) => {
    if (!extras[field] && data.step1?.[field]) {
      extras[field] = normalizeExtraValue(field, data.step1[field]);
    }
  });

  const catalog = getSchemeSteps(schemeCode).filter((s) => s.id !== 'uploads' && s.contentStep !== 18);
  const filledSteps: number[] = [];
  const failedSteps: number[] = [];

  for (let index = 0; index < catalog.length; index++) {
    const def = catalog[index];
    const contentStep = def.contentStep;
    onProgress?.({ step: def.n, index: index + 1, total: catalog.length });

    const currentStepData = {
      ...(getStepData(contentStep) || data[`step${contentStep}`] || {}),
    };
    const priorContent = catalog.slice(0, index).map((s) => s.contentStep);
    const previous = previousStepsPayload(data, priorContent, schemeCode, answers?.budget);
    const exclude = excludeForStep(contentStep, schemeCode, answers?.budget);

    try {
      const suggestions = await AISuggestionsService.getSuggestionsForStep(
        contentStep,
        currentStepData,
        previous,
        exclude
      );

      if (!suggestions?.length) {
        if (contentStep === 1 && extraFieldNames.length && setSchemeExtras) {
          extras = inferMissingExtras(schemeCode, currentStepData, extras);
          setSchemeExtras(extras);
          data = { ...data, schemeExtras: extras };
        }
        failedSteps.push(def.n);
        continue;
      }

      const nextStepData = { ...currentStepData };
      let applied = 0;
      let extrasChanged = false;

      for (const suggestion of suggestions) {
        const field = suggestion.field;
        if (!field || IDENTITY_FIELDS.includes(field) || exclude.includes(field)) continue;

        const text =
          typeof suggestion.suggestion === 'string'
            ? suggestion.suggestion
            : JSON.stringify(suggestion.suggestion);
        let value = suggestionToFieldValue(field, text);
        if (schemeCode === 'AP_CMEP' && field === 'yearProjections' && Array.isArray(value)) {
          value = mergeCmepProjectedSuggestion(nextStepData.yearProjections, value);
        }
        if (value === null || value === undefined) continue;

        if (extraFieldNames.includes(field)) {
          extras = { ...extras, [field]: normalizeExtraValue(field, value) };
          extrasChanged = true;
          applied += 1;
          continue;
        }

        nextStepData[field] = value;
        applied += 1;
      }

      if (applied === 0 && !(contentStep === 1 && extraFieldNames.length)) {
        failedSteps.push(def.n);
        continue;
      }

      if (contentStep === 1 && extraFieldNames.length) {
        extras = inferMissingExtras(schemeCode, nextStepData, extras);
        extrasChanged = true;
        extraFieldNames.forEach((field) => {
          delete nextStepData[field];
        });
        applied = Math.max(applied, 1);
      }

      if (applied === 0) {
        failedSteps.push(def.n);
        continue;
      }

      setStepData(contentStep, nextStepData);
      data = { ...data, [`step${contentStep}`]: nextStepData };
      if (extrasChanged && setSchemeExtras) {
        setSchemeExtras(extras);
        data = { ...data, schemeExtras: extras };
      }
      filledSteps.push(def.n);
    } catch (error) {
      console.error(`AI fill failed for step ${def.n} (content ${contentStep}):`, error);
      failedSteps.push(def.n);
    }
  }

  return { filledSteps, failedSteps };
}
