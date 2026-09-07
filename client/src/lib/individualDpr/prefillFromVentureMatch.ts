import { VentureMatchAnswers } from '@/lib/ventureMatch/types';

const ACTIVITY_SECTOR: Record<string, string> = {
  mfg: 'Manufacturing',
  food: 'Food Processing',
  craft: 'Traditional craft / artisan trade',
  service: 'Services',
  trade: 'Trading',
  vending: 'Street vending',
  crop: 'Agriculture',
  mixed: 'Mixed activities',
};

const LEGAL_LABEL: Record<string, string> = {
  sole: 'Sole proprietorship',
  partnership: 'Partnership / LLP',
  company: 'Private / Public limited company',
  unregistered: 'Not registered yet',
  otherEntity: 'SHG / cooperative / trust / society / FPO',
};

const BUDGET_MID_LAKHS: Record<string, number> = {
  under2L: 1,
  '2to5L': 3.5,
  '5to10L': 7.5,
  '10to20L': 15,
  '20to50L': 35,
  '50Lto1Cr': 75,
  '1to10Cr': 550,
  above10Cr: 1500,
};

export function prefillFromVentureMatch(answers: VentureMatchAnswers) {
  const skipSector = answers.activity === 'notBusiness' || answers.activity === 'notSure';
  const sector = skipSector ? '' : answers.activity ? ACTIVITY_SECTOR[answers.activity] || '' : '';
  const cost =
    answers.budget && answers.budget !== 'none' && answers.budget !== 'notSure'
      ? BUDGET_MID_LAKHS[answers.budget]
      : 0;
  const locationType =
    answers.location === 'rural'
      ? 'Village'
      : answers.location === 'apiic'
        ? 'APIIC industrial park'
        : answers.location === 'urban'
          ? 'City / town'
          : answers.location === 'home'
            ? 'Home-based'
            : answers.location === 'outsideAp'
              ? 'Outside Andhra Pradesh'
              : '';
  const udyamText =
    answers.udyam === 'yes'
      ? 'Udyam registered'
      : answers.udyam === 'willing' || answers.udyam === 'applied'
        ? 'Will take Udyam registration'
        : '';
  const stageDesc =
    answers.stage === 'greenfield'
      ? 'New unit.'
      : answers.stage === 'brownfield'
        ? 'Existing unit – expansion or upgrade.'
        : answers.stage === 'idea'
          ? 'Idea stage.'
          : answers.stage === 'restart'
            ? 'Restarting a closed unit.'
            : '';

  return {
    step1: {
      clusterName: '',
      district: answers.domicile === 'ap' ? 'Andhra Pradesh' : '',
      location: locationType,
      natureOfBusiness: sector,
      majorProducts: '',
    },
    step2: {
      sectorType: sector,
      sectorDescription: stageDesc,
    },
    step3: {
      geography: answers.domicile === 'ap' ? 'Andhra Pradesh' : answers.domicile === 'other' ? 'Other Indian state' : '',
      connectivity: {
        road: locationType,
      },
    },
    step4: {
      presentActivities: sector,
      typeOfUnits: 'Individual enterprise',
      technologyLevel: answers.stage === 'brownfield' ? 'Existing unit' : 'New unit',
    },
    step10: {
      location: locationType,
      landDetails: answers.location === 'apiic' ? 'Unit proposed inside an APIIC industrial park.' : '',
    },
    step11: {
      spvName: '',
      legalStatus: answers.legal ? LEGAL_LABEL[answers.legal] : '',
      submittedTo: udyamText,
    },
    step12: cost
      ? {
          machinery: Math.round(cost * 0.5 * 10) / 10,
          building: Math.round(cost * 0.3 * 10) / 10,
          workingCapitalMargin: Math.round(cost * 0.2 * 10) / 10,
        }
      : {},
    step13: cost
      ? {
          spvContribution: Math.round(cost * 0.25 * 10) / 10,
          bankLoan: Math.round(cost * 0.75 * 10) / 10,
        }
      : {},
  };
}
