import { Budget, VentureMatchAnswers } from '@/lib/ventureMatch/types';
import { isIndividualPickerScheme, SCHEMES } from '@/lib/ventureMatch/schemes';
import { PMEGP_EXTRA_FIELDS, PMEGP_IMPACT_BULLETS } from '@/lib/individualDpr/pmegpQuestions';
import { PMEGP_2ND_EXTRA_FIELDS, PMEGP_2ND_IMPACT_BULLETS } from '@/lib/individualDpr/pmegp2ndQuestions';
import { MUDRA_EXTRA_FIELDS, MUDRA_IMPACT_BULLETS } from '@/lib/individualDpr/mudraQuestions';
import { STANDUP_EXTRA_FIELDS, STANDUP_IMPACT_BULLETS } from '@/lib/individualDpr/standupQuestions';
import { PMFME_EXTRA_FIELDS, PMFME_IMPACT_BULLETS } from '@/lib/individualDpr/pmfmeQuestions';
import { SCLCSS_EXTRA_FIELDS, SCLCSS_IMPACT_BULLETS } from '@/lib/individualDpr/sclcssQuestions';
import {
  getSchemeSteps,
  getStepDef,
  localToContent,
} from '@/lib/individualDpr/schemeStepCatalog';

export const SCHEME_OPTIONS = [
  { code: '', label: 'Vanilla bank term loan (standard individual DPR)' },
  ...SCHEMES.filter((s) => isIndividualPickerScheme(s.code)).map((s) => ({
    code: s.code,
    label: s.name,
  })),
];

export const SCHEME_EXTRA_FIELDS: Record<string, string[]> = {
  VISHWAKARMA: ['craft', 'currentTools', 'newTools'],
  SVANIDHI: ['covOrLor', 'upiQr'],
  PMFME: [...PMFME_EXTRA_FIELDS],
  AP_EDP: ['apiicPark'],
  PMEGP: [...PMEGP_EXTRA_FIELDS],
  MUDRA: [...MUDRA_EXTRA_FIELDS],
  STANDUP: [...STANDUP_EXTRA_FIELDS],
  PMEGP_2ND: [...PMEGP_2ND_EXTRA_FIELDS],
  SCLCSS: [...SCLCSS_EXTRA_FIELDS],
  AP_TECH_UPGRADE: ['existingTech', 'proposedTech'],
  MSE_GIFT: ['energyBaselineKwh', 'expectedSaving'],
  ZED: ['zedCurrentLevel', 'zedTargetLevel'],
  LEAN: ['processBottleneck'],
  MSME_IPR: ['ipType', 'filingStage'],
  PMS: ['eventName', 'stallSize'],
  CVY: ['coirProductLine', 'coirBoardStatus'],
  NHDP: ['loomType', 'weaverId'],
  PTUAS: ['gmpStatus', 'productLicence'],
  PMPDS: ['deviceOrFormulation'],
  SCST_HUB: ['gemExperience'],
  ASPIRE: ['incubatorName'],
  ECLGS: ['existingLimit', 'additionalWcSought'],
};

export function extraFieldsForScheme(schemeCode: string | null | undefined): string[] {
  if (!schemeCode) return [];
  return SCHEME_EXTRA_FIELDS[schemeCode] || [];
}

export function isSchemeExtraField(field: string, schemeCode?: string | null): boolean {
  const known = Object.values(SCHEME_EXTRA_FIELDS).flat();
  if (!known.includes(field)) return false;
  if (!schemeCode) return true;
  return extraFieldsForScheme(schemeCode).includes(field);
}

export const VISHWAKARMA_CRAFTS = [
  'Carpenter (Suthar)',
  'Boat Maker',
  'Armourer',
  'Blacksmith',
  'Hammer and Tool Kit Maker',
  'Locksmith',
  'Sculptor',
  'Stone breaker / Stone carver',
  'Goldsmith',
  'Potter',
  'Sculptor (metal/stone/wood)',
  'Cobbler / Shoemaker',
  'Mason',
  'Basket/Mat/Broom Maker / Coir Weaver',
  'Doll & Toy Maker',
  'Barber',
  'Garland Maker',
  'Washerman',
  'Tailor',
  'Fishing Net Maker',
];

export type UploadField = { id: string; label: string };

const DEFAULT_UPLOADS: UploadField[] = [
  { id: 'aadhaarPan', label: 'Aadhaar / PAN' },
  { id: 'udyamCertificate', label: 'Udyam Certificate' },
  { id: 'bankPassbook', label: 'Bank Passbook' },
  { id: 'machineryQuotations', label: 'Machinery / Equipment Quotations' },
];

const SHISHU_KISHORE: Budget[] = ['under2L', '2to5L'];

export function isMudraShishuKishore(code: string | null, budget?: Budget): boolean {
  return code === 'MUDRA' && !!budget && SHISHU_KISHORE.includes(budget);
}

export function isMudraTarunPlus(code: string | null, budget?: Budget): boolean {
  return code === 'MUDRA' && (budget === '50Lto1Cr' || budget === '1to10Cr' || budget === 'above10Cr');
}

export function hideComplexCapex(code: string | null, budget?: Budget): boolean {
  return isMudraShishuKishore(code, budget);
}

export function showDscr(bankLoanLakhs: number): boolean {
  return (bankLoanLakhs || 0) > 0;
}

export function showPmegpEducationGate(
  code: string | null,
  activity: string | undefined,
  totalCostLakhs: number
): boolean {
  if (code !== 'PMEGP' && code !== 'PMEGP_2ND') return false;
  const mfg = activity === 'mfg' || activity === 'food' || activity === 'craft';
  const service =
    activity === 'service' ||
    activity === 'knowledge' ||
    activity === 'trade' ||
    activity === 'vending' ||
    activity === 'mixed';
  if (mfg && totalCostLakhs > 10) return true;
  if (service && totalCostLakhs > 5) return true;
  return false;
}

/** Consecutive local steps 1..N for this scheme (not a shared 18 with gaps). */
export function getVisibleSteps(code: string | null): number[] {
  return getSchemeSteps(code).map((s) => s.n);
}

export function getStepTitle(localStep: number, schemeCode?: string | null): string {
  const def = getStepDef(schemeCode, localStep);
  if (def) return def.title;
  return `Step ${localStep}`;
}

/** Map UI local step → store/AI content bucket. */
export function getContentStep(localStep: number, schemeCode?: string | null): number {
  return localToContent(schemeCode, localStep);
}

/** @deprecated Prefer getSchemeSteps — kept for any leftover callers. */
export function getHiddenSteps(_code: string | null): number[] {
  return [];
}

export function getStep18Uploads(
  code: string | null,
  answers?: VentureMatchAnswers | null,
  schemeExtras?: Record<string, any> | null
): UploadField[] {
  if (code === 'VISHWAKARMA') {
    return [
      { id: 'aadhaarPan', label: 'Aadhaar' },
      { id: 'bankPassbook', label: 'Savings Bank Passbook' },
      { id: 'rationCard', label: 'Ration Card (family verification)' },
    ];
  }
  if (code === 'SVANIDHI') {
    return [{ id: 'covOrLor', label: 'Certificate of Vending (CoV) or Letter of Recommendation' }];
  }
  if (code === 'PMFME') {
    const uploads: UploadField[] = [
      { id: 'machineryQuotations', label: 'Machinery Quotations' },
      { id: 'premisesLease', label: 'Land / Premises Lease or Ownership Proof' },
      { id: 'fssaiDraft', label: 'FSSAI Licence / Draft Registration' },
      { id: 'aadhaarPan', label: 'Aadhaar / PAN' },
      { id: 'udyamCertificate', label: 'Udyam Certificate (or application)' },
      { id: 'bankPassbook', label: 'Bank Passbook / Cancelled Cheque' },
    ];
    if (schemeExtras?.unitStage === 'existing') {
      uploads.push({ id: 'existingUnitPhotos', label: 'Photos of Existing Unit' });
    }
    return uploads;
  }
  if (code === 'PMEGP' || code === 'PMEGP_2ND') {
    const uploads: UploadField[] = [
      { id: 'aadhaarPan', label: 'Aadhaar / PAN' },
      { id: 'machineryQuotations', label: 'Machinery Quotations' },
      { id: 'buildingEstimates', label: 'Building / Workshed Estimate' },
      { id: 'bankPassbook', label: 'Bank Passbook / Cancelled Cheque' },
      { id: 'udyamCertificate', label: 'Udyam Certificate (or application)' },
    ];
    if (code === 'PMEGP_2ND') {
      uploads.push(
        { id: 'priorSanctionLetter', label: 'Prior PMEGP / REGP / MUDRA Sanction Letter' },
        { id: 'caExistingInvestment', label: 'CA Certificate of Existing Investment' },
        { id: 'profitStatements', label: 'Last 3 Years Profit / ITR Statements' }
      );
    }
    const owner = answers?.owner || [];
    const specialCategory =
      schemeExtras?.pmegpCategory === 'special' ||
      owner.some((o) => ['sc', 'st', 'bc'].includes(o));
    if (code === 'PMEGP' && specialCategory) {
      uploads.push({ id: 'casteCertificate', label: 'Caste / Special-category Certificate' });
    }
    return uploads;
  }
  if (code === 'SCLCSS') {
    const uploads: UploadField[] = [
      { id: 'casteCertificate', label: 'SC / ST Caste Certificate' },
      { id: 'machineryQuotations', label: 'Machinery Quotations (tech specs)' },
      { id: 'udyamCertificate', label: 'Udyam Certificate' },
      { id: 'aadhaarPan', label: 'Aadhaar / PAN' },
      { id: 'termLoanSanction', label: 'Term Loan Sanction / In-principle' },
    ];
    if (schemeExtras?.unitStage !== 'new') {
      uploads.push({ id: 'caExistingInvestment', label: 'CA Certificate of Existing FCI' });
    }
    uploads.push({
      id: 'ownershipProof',
      label: '51% SC/ST Shareholding Proof (if not sole proprietor)',
    });
    return uploads;
  }
  if (code === 'AP_EDP') {
    return [
      { id: 'landShedAllotment', label: 'Land / Shed Allotment' },
      { id: 'cfeCfo', label: 'Single Desk Pollution Clearances (CFE/CFO)' },
      { id: 'caFciStatement', label: 'CA-certified FCI Statement' },
    ];
  }
  if (code === 'MUDRA') {
    const uploads: UploadField[] = [
      { id: 'shopAddressProof', label: 'Shop Address Proof' },
      { id: 'bankStatements', label: 'Bank Statements' },
      { id: 'machineryQuotations', label: 'Machinery / Equipment Quotations' },
      { id: 'aadhaarPan', label: 'Aadhaar / PAN' },
      { id: 'udyamCertificate', label: 'Udyam Certificate (or application)' },
    ];
    if (
      isMudraTarunPlus(code, answers?.budget) ||
      schemeExtras?.mudraCategory === 'tarunPlus'
    ) {
      uploads.push({ id: 'mudraClosure', label: 'Previous Mudra Loan Repayment / Closure Certificate' });
    }
    return uploads;
  }
  if (code === 'STANDUP') {
    const uploads: UploadField[] = [
      { id: 'aadhaarPan', label: 'Aadhaar / PAN' },
      { id: 'machineryQuotations', label: 'Machinery Quotations' },
      { id: 'buildingEstimates', label: 'Building Estimate / Premises Lease' },
      { id: 'udyamCertificate', label: 'Udyam Certificate (or application)' },
      { id: 'bankPassbook', label: 'Bank Passbook / Cancelled Cheque' },
    ];
    const cat = schemeExtras?.standupCategory;
    if (cat === 'sc' || cat === 'st') {
      uploads.push({ id: 'casteCertificate', label: 'Caste Certificate (SC / ST)' });
    }
    uploads.push({
      id: 'ownershipProof',
      label: '51% Controlling Stake Proof (if not sole proprietor)',
    });
    return uploads;
  }
  if (code === 'ECLGS') {
    return [
      { id: 'udyamCertificate', label: 'Udyam Certificate' },
      { id: 'gstItr', label: 'GST Returns / ITR' },
      { id: 'bankStatements', label: 'Bank Statements' },
      { id: 'existingSanction', label: 'Existing Sanction Letter' },
      { id: 'caTurnover', label: 'CA Turnover Certificate' },
    ];
  }
  if (code === 'ZED' || code === 'LEAN' || code === 'MSME_IPR') {
    return [
      { id: 'udyamCertificate', label: 'Udyam Certificate' },
      { id: 'aadhaarPan', label: 'Aadhaar / PAN' },
    ];
  }
  if (code === 'PMS') {
    return [
      { id: 'udyamCertificate', label: 'Udyam Certificate' },
      { id: 'fairPhotos', label: 'Previous Fair Photos (optional)' },
    ];
  }
  if (code === 'MSE_GIFT') {
    return [
      { id: 'energyBill', label: 'Recent Energy Bill' },
      { id: 'machineryQuotations', label: 'EE Equipment Quotations' },
      { id: 'udyamCertificate', label: 'Udyam Certificate' },
    ];
  }
  if (code === 'CVY') {
    return [
      { id: 'coirBoardDocs', label: 'Coir Board Documents' },
      { id: 'machineryQuotations', label: 'Machinery Quotations' },
      { id: 'udyamCertificate', label: 'Udyam Certificate' },
    ];
  }
  if (code === 'NHDP') {
    return [
      { id: 'weaverId', label: 'Weaver ID / Handloom Corp Membership' },
      { id: 'aadhaarPan', label: 'Aadhaar' },
      { id: 'bankPassbook', label: 'Bank Passbook' },
    ];
  }
  if (code === 'PTUAS' || code === 'PMPDS') {
    return [
      { id: 'manufacturingLicence', label: 'Manufacturing / Product Licence' },
      { id: 'pollutionConsent', label: 'Pollution Consent' },
      { id: 'machineryQuotations', label: 'Machinery Quotations' },
      { id: 'caFciStatement', label: 'CA FCI Statement' },
      { id: 'udyamCertificate', label: 'Udyam Certificate' },
    ];
  }
  if (code === 'SCST_HUB') {
    return [
      { id: 'casteCertificate', label: 'Caste Certificate' },
      { id: 'udyamCertificate', label: 'Udyam Certificate' },
      { id: 'cancelledCheque', label: 'Cancelled Cheque' },
    ];
  }
  return DEFAULT_UPLOADS;
}

export function getSchemeImpact(code: string | null): {
  title: string;
  bullets: string[];
  firstChangedStep: number;
} {
  if (code === 'VISHWAKARMA') {
    return {
      title: 'PM Vishwakarma',
      bullets: [
        'Own 15-step pack (steps numbered 1–15 consecutively).',
        'Step 1 adds craft + current/new tools (₹15,000 voucher).',
        'Final step uploads: Aadhaar, passbook, ration card.',
      ],
      firstChangedStep: 1,
    };
  }
  if (code === 'SVANIDHI') {
    return {
      title: 'PM SVANidhi',
      bullets: [
        'Own 15-step pack (1–15 consecutively).',
        'Step 1 adds CoV vs LoR and UPI QR.',
        'Final step upload: CoV or Letter of Recommendation.',
      ],
      firstChangedStep: 1,
    };
  }
  if (code === 'PMFME') {
    return {
      title: 'PMFME',
      bullets: [...PMFME_IMPACT_BULLETS],
      firstChangedStep: 1,
    };
  }
  if (code === 'PMEGP') {
    return {
      title: 'PMEGP',
      bullets: [...PMEGP_IMPACT_BULLETS],
      firstChangedStep: 1,
    };
  }
  if (code === 'PMEGP_2ND') {
    return {
      title: '2nd PMEGP Loan',
      bullets: [...PMEGP_2ND_IMPACT_BULLETS],
      firstChangedStep: 1,
    };
  }
  if (code === 'SCLCSS') {
    return {
      title: 'SCLCSS (SC/ST only)',
      bullets: [...SCLCSS_IMPACT_BULLETS],
      firstChangedStep: 1,
    };
  }
  if (code === 'ECLGS') {
    return {
      title: 'ECLGS',
      bullets: [
        'Own 7-step working-capital pack (numbered 1–7).',
        'Not a greenfield capex / Gantt DPR.',
        'Final step: Udyam, GST/ITR, bank statements, existing sanction.',
      ],
      firstChangedStep: 1,
    };
  }
  if (code === 'ZED' || code === 'LEAN' || code === 'MSME_IPR' || code === 'PMS') {
    return {
      title: code,
      bullets: [
        'Own 5-step short pack (numbered 1–5) — not an 18-step bank P&L.',
        'Unit identity, profile, market, applicant, uploads only.',
        'Use this pack for certification / consulting / fair support.',
      ],
      firstChangedStep: 1,
    };
  }
  if (code === 'MUDRA') {
    return {
      title: 'MUDRA',
      bullets: [...MUDRA_IMPACT_BULLETS],
      firstChangedStep: 1,
    };
  }
  if (code === 'STANDUP') {
    return {
      title: 'Stand-Up India',
      bullets: [...STANDUP_IMPACT_BULLETS],
      firstChangedStep: 1,
    };
  }
  if (code === 'AP_EDP') {
    return {
      title: 'AP EDP',
      bullets: [
        'Step 1 asks if the unit is in an APIIC park (land-rebate hint).',
        'Step 12 keeps land / building / P&M (FCI).',
        'Step 18: land/shed, CFE/CFO, CA FCI statement.',
      ],
      firstChangedStep: 1,
    };
  }
  if (code) {
    return {
      title: code,
      bullets: [
        'No extra fields on steps 1–17 for this scheme in v1.',
        'Step 18 uses the default individual upload list (Aadhaar/PAN, Udyam, passbook, quotations).',
      ],
      firstChangedStep: 18,
    };
  }
  return {
    title: 'Vanilla bank term loan',
    bullets: [
      'All 18 steps. No scheme extras on step 1.',
      'Step 18: Aadhaar/PAN, Udyam, passbook, machinery quotations.',
    ],
    firstChangedStep: 1,
  };
}

export function nayakWorkingCapital(turnoverLakhs: number): { limit: number; margin: number } {
  const limit = turnoverLakhs * 0.2;
  const margin = limit * 0.05;
  return { limit, margin };
}
