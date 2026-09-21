import { AISuggestionsService } from '@/services/aiSuggestions.service';
import { extraFieldsForScheme, VISHWAKARMA_CRAFTS, hideComplexCapex } from '@/lib/individualDpr/schemeFormConfig';
import { getSchemeSteps } from '@/lib/individualDpr/schemeStepCatalog';
import { suggestionToFieldValue } from '@/lib/dprAiFieldNormalize';
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
  }
  if (schemeCode === 'SVANIDHI') {
    if (!next.covOrLor) next.covOrLor = 'cov';
    if (!next.upiQr) next.upiQr = 'UPI QR to be linked to the vendor bank account.';
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
  if (schemeCode === 'AP_EDP' && !next.apiicPark) {
    next.apiicPark = /apiic|industrial park/i.test(hint) ? 'yes' : 'no';
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
  schemeCode: string | null
) {
  const previous: Record<string, any> = {
    _isIndividualDPR: true,
    ...(schemeCode ? { _schemeCode: schemeCode } : {}),
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
    const previous = previousStepsPayload(data, priorContent, schemeCode);
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
        const value = suggestionToFieldValue(field, text);
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
