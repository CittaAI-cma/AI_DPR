/**
 * AP CMEP — Create New Latest DPR question catalog.
 * Spec: docs/schemes/AP_CMEP/apCmep.md
 * Step list: AP_CMEP_STEPS (13 consecutive steps).
 */

export const AP_CMEP_EXTRA_FIELDS = [
  'activityBand',
  'boosterCategory',
  'apDomicile',
  'entrepreneurName',
  'processOfManufacture',
  'premisesType',
] as const;

export type ApCmepExtraField = (typeof AP_CMEP_EXTRA_FIELDS)[number];

export const AP_CMEP_ACTIVITY_OPTIONS = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'knowledge', label: 'Knowledge / service enterprise' },
];

export const AP_CMEP_BOOSTER_OPTIONS = [
  { value: 'none', label: 'General (no booster)' },
  { value: 'woman', label: 'Woman entrepreneur' },
  { value: 'pwd', label: 'PwD' },
  { value: 'exServiceman', label: 'Ex-serviceman' },
  { value: 'transgender', label: 'Transgender' },
];

export const AP_CMEP_YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const AP_CMEP_IMPACT_BULLETS = [
  'Own 13-step greenfield pack for AP CMEP.',
  'Step 1 asks mfg vs knowledge + booster (woman/PwD/ex-serviceman/transgender).',
  'Must be bank-linked — zero-loan projects are out of scope.',
];
