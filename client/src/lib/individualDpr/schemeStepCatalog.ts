/**
 * Per-scheme step catalogs for Create New Latest DPR.
 * UI shows consecutive Step 1..N for each scheme (no gaps from a shared 18-step skeleton).
 * `contentStep` is the store / AI / PDF bucket (legacy individual slot) so generation keeps working.
 */

export type SchemeStepDef = {
  /** Consecutive index shown in the UI for this scheme (1..N). */
  n: number;
  /** Stable semantic id within the scheme. */
  id: string;
  title: string;
  /** Data / AI / PDF bucket (`step${contentStep}` in the store). */
  contentStep: number;
};

function catalog(
  defs: Array<{ id: string; title: string; contentStep: number }>
): SchemeStepDef[] {
  return defs.map((d, i) => {
    const n = i + 1;
    const bare = d.title.replace(/^Step \d+:\s*/, '');
    return {
      n,
      id: d.id,
      title: `Step ${n}: ${bare}`,
      contentStep: d.contentStep,
    };
  });
}

/** Vanilla / full individual bank DPR — 18 consecutive steps (contentStep === n). */
export const VANILLA_STEPS: SchemeStepDef[] = catalog([
  { id: 'cover', title: 'Step 1: Your unit – basic details', contentStep: 1 },
  { id: 'sector', title: 'Step 2: Sector overview', contentStep: 2 },
  { id: 'location', title: 'Step 3: District & location', contentStep: 3 },
  { id: 'unit', title: 'Step 4: Your unit profile', contentStep: 4 },
  { id: 'valueChain', title: 'Step 5: Value chain', contentStep: 5 },
  { id: 'market', title: 'Step 6: Market', contentStep: 6 },
  { id: 'gaps', title: 'Step 7: Gaps', contentStep: 7 },
  { id: 'swot', title: 'Step 8: SWOT', contentStep: 8 },
  { id: 'plan', title: 'Step 9: What you plan to do', contentStep: 9 },
  { id: 'shed', title: 'Step 10: Workplace / shed / unit', contentStep: 10 },
  { id: 'applicant', title: 'Step 11: Applicant / firm', contentStep: 11 },
  { id: 'cost', title: 'Step 12: Project cost', contentStep: 12 },
  { id: 'finance', title: 'Step 13: Means of finance', contentStep: 13 },
  { id: 'operating', title: 'Step 14: Operating cost & sales', contentStep: 14 },
  { id: 'viability', title: 'Step 15: Financial viability', contentStep: 15 },
  { id: 'schedule', title: 'Step 16: Implementation schedule', contentStep: 16 },
  { id: 'impact', title: 'Step 17: Expected impact', contentStep: 17 },
  { id: 'uploads', title: 'Step 18: Document uploads', contentStep: 18 },
]);

/**
 * PMEGP bank-unit DPR — 14 consecutive steps (KVIC profile structure).
 * Spec: docs/schemes/PMEGP/pmegp.md
 */
export const PMEGP_STEPS: SchemeStepDef[] = catalog([
  { id: 'cover', title: 'Cover & entrepreneur', contentStep: 1 },
  { id: 'intro', title: 'Introduction & process', contentStep: 2 },
  { id: 'location', title: 'Location', contentStep: 3 },
  { id: 'unit', title: 'Unit profile & capacity', contentStep: 4 },
  { id: 'market', title: 'Market & sales assumptions', contentStep: 6 },
  { id: 'shed', title: 'Workshed / premises & power', contentStep: 10 },
  { id: 'applicant', title: 'Applicant / firm', contentStep: 11 },
  { id: 'cost', title: 'Project cost', contentStep: 12 },
  { id: 'finance', title: 'Means of finance (critical)', contentStep: 13 },
  { id: 'operating', title: 'Operating cost & sales', contentStep: 14 },
  { id: 'viability', title: 'Financial viability', contentStep: 15 },
  { id: 'schedule', title: 'Implementation schedule', contentStep: 16 },
  { id: 'impact', title: 'Employment & impact', contentStep: 17 },
  { id: 'uploads', title: 'Documents & uploads', contentStep: 18 },
]);

/**
 * MUDRA (PMMY) bank-unit pack — 12 consecutive steps.
 * Spec: docs/schemes/MUDRA/mudra.md
 */
export const MUDRA_STEPS: SchemeStepDef[] = catalog([
  { id: 'cover', title: 'Cover & category', contentStep: 1 },
  { id: 'intro', title: 'Business activity', contentStep: 2 },
  { id: 'location', title: 'Location', contentStep: 3 },
  { id: 'unit', title: 'Unit profile', contentStep: 4 },
  { id: 'market', title: 'Market & sales assumptions', contentStep: 6 },
  { id: 'shed', title: 'Premises', contentStep: 10 },
  { id: 'applicant', title: 'Applicant / firm', contentStep: 11 },
  { id: 'cost', title: 'Project cost', contentStep: 12 },
  { id: 'finance', title: 'Means of finance', contentStep: 13 },
  { id: 'operating', title: 'Operating cost & sales', contentStep: 14 },
  { id: 'viability', title: 'Financial viability', contentStep: 15 },
  { id: 'uploads', title: 'Documents & uploads', contentStep: 18 },
]);

/**
 * Stand-Up India bank-unit pack — 13 consecutive steps (₹10 L–₹1 Cr composite).
 * Spec: docs/schemes/STANDUP/standup.md
 */
export const STANDUP_STEPS: SchemeStepDef[] = catalog([
  { id: 'cover', title: 'Cover & eligibility', contentStep: 1 },
  { id: 'intro', title: 'Business activity & process', contentStep: 2 },
  { id: 'location', title: 'Location', contentStep: 3 },
  { id: 'unit', title: 'Unit profile & capacity', contentStep: 4 },
  { id: 'market', title: 'Market, buyers & competition', contentStep: 6 },
  { id: 'shed', title: 'Premises', contentStep: 10 },
  { id: 'applicant', title: 'Applicant / firm', contentStep: 11 },
  { id: 'cost', title: 'Project cost', contentStep: 12 },
  { id: 'finance', title: 'Means of finance', contentStep: 13 },
  { id: 'operating', title: 'Operating cost & sales', contentStep: 14 },
  { id: 'viability', title: 'Financial viability', contentStep: 15 },
  { id: 'schedule', title: 'Implementation schedule', contentStep: 16 },
  { id: 'uploads', title: 'Documents & uploads', contentStep: 18 },
]);

/**
 * PMFME food-unit pack — 14 consecutive steps (NIFTEM / MoFPI individual path).
 * Spec: docs/schemes/PMFME/pmfme.md
 */
export const PMFME_STEPS: SchemeStepDef[] = catalog([
  { id: 'cover', title: 'Cover & formalisation', contentStep: 1 },
  { id: 'intro', title: 'Introduction & process', contentStep: 2 },
  { id: 'location', title: 'Location', contentStep: 3 },
  { id: 'unit', title: 'Unit profile & capacity', contentStep: 4 },
  { id: 'market', title: 'Market, buyers & raw material', contentStep: 6 },
  { id: 'shed', title: 'Premises & utilities', contentStep: 10 },
  { id: 'applicant', title: 'Applicant / firm', contentStep: 11 },
  { id: 'cost', title: 'Project cost', contentStep: 12 },
  { id: 'finance', title: 'Means of finance (critical)', contentStep: 13 },
  { id: 'operating', title: 'Operating cost & sales', contentStep: 14 },
  { id: 'viability', title: 'Financial viability', contentStep: 15 },
  { id: 'schedule', title: 'Implementation schedule', contentStep: 16 },
  { id: 'impact', title: 'Employment & impact', contentStep: 17 },
  { id: 'uploads', title: 'Documents & uploads', contentStep: 18 },
]);

/**
 * PMEGP 2nd loan (upgrade) — 14 consecutive steps (brownfield PMEGP/REGP/MUDRA).
 * Spec: docs/schemes/PMEGP_2ND/pmegp2nd.md
 */
export const PMEGP_2ND_STEPS: SchemeStepDef[] = catalog([
  { id: 'cover', title: 'Cover & prior assistance', contentStep: 1 },
  { id: 'intro', title: 'Introduction & upgrade process', contentStep: 2 },
  { id: 'location', title: 'Location', contentStep: 3 },
  { id: 'unit', title: 'Unit profile & capacity (existing → proposed)', contentStep: 4 },
  { id: 'market', title: 'Market & sales assumptions', contentStep: 6 },
  { id: 'shed', title: 'Workshed / premises & power', contentStep: 10 },
  { id: 'applicant', title: 'Applicant / firm', contentStep: 11 },
  { id: 'cost', title: 'Upgrade project cost', contentStep: 12 },
  { id: 'finance', title: 'Means of finance (critical)', contentStep: 13 },
  { id: 'operating', title: 'Operating cost & sales', contentStep: 14 },
  { id: 'viability', title: 'Financial viability', contentStep: 15 },
  { id: 'schedule', title: 'Implementation schedule', contentStep: 16 },
  { id: 'impact', title: 'Employment & impact', contentStep: 17 },
  { id: 'uploads', title: 'Documents & uploads', contentStep: 18 },
]);

/**
 * SCLCSS (SC/ST capital subsidy) — 13 consecutive steps (tech / P&M focused).
 * Spec: docs/schemes/SCLCSS/sclcss.md
 */
export const SCLCSS_STEPS: SchemeStepDef[] = catalog([
  { id: 'cover', title: 'Cover & SC/ST eligibility', contentStep: 1 },
  { id: 'intro', title: 'Technology upgrade story', contentStep: 2 },
  { id: 'location', title: 'Location', contentStep: 3 },
  { id: 'unit', title: 'Unit profile & capacity', contentStep: 4 },
  { id: 'market', title: 'Market & offtake', contentStep: 6 },
  { id: 'shed', title: 'Premises', contentStep: 10 },
  { id: 'applicant', title: 'Applicant / firm', contentStep: 11 },
  { id: 'cost', title: 'Project cost (machinery-led)', contentStep: 12 },
  { id: 'finance', title: 'Means of finance (critical)', contentStep: 13 },
  { id: 'operating', title: 'Operating cost & sales', contentStep: 14 },
  { id: 'viability', title: 'Financial viability', contentStep: 15 },
  { id: 'schedule', title: 'Implementation schedule', contentStep: 16 },
  { id: 'uploads', title: 'Documents & uploads', contentStep: 18 },
]);

/** Full bank DPR minus viability / schedule / impact (15 consecutive steps). */
const FULL_MINUS_LATE: SchemeStepDef[] = catalog(
  VANILLA_STEPS.filter((s) => ![15, 16, 17].includes(s.contentStep)).map((s) => ({
    id: s.id,
    title: s.title,
    contentStep: s.contentStep,
  }))
);
/** Identity + profile + market + applicant + uploads (cert / consulting overlays). */
const SHORT_CERT_STEPS: SchemeStepDef[] = catalog([
  { id: 'cover', title: 'Step 1: Unit basics', contentStep: 1 },
  { id: 'unit', title: 'Step 2: Unit profile', contentStep: 4 },
  { id: 'market', title: 'Step 3: Market / need', contentStep: 6 },
  { id: 'applicant', title: 'Step 4: Applicant / firm', contentStep: 11 },
  { id: 'uploads', title: 'Step 5: Documents & uploads', contentStep: 18 },
]);

/** Working-capital focused (ECLGS). */
const SHORT_WC_STEPS: SchemeStepDef[] = catalog([
  { id: 'cover', title: 'Step 1: Unit basics', contentStep: 1 },
  { id: 'unit', title: 'Step 2: Unit profile', contentStep: 4 },
  { id: 'applicant', title: 'Step 3: Applicant / firm', contentStep: 11 },
  { id: 'cost', title: 'Step 4: Project / WC cost', contentStep: 12 },
  { id: 'finance', title: 'Step 5: Means of finance', contentStep: 13 },
  { id: 'operating', title: 'Step 6: Operating cost & sales', contentStep: 14 },
  { id: 'uploads', title: 'Step 7: Documents & uploads', contentStep: 18 },
]);

const SHORT_CERT_CODES = new Set(['ZED', 'LEAN', 'MSME_IPR', 'PMS', 'SCST_HUB']);
const SHORT_WC_CODES = new Set(['ECLGS']);
const FULL_MINUS_LATE_CODES = new Set(['VISHWAKARMA', 'SVANIDHI', 'NHDP', 'ASPIRE']);

/** Scheme code → catalog. Missing codes fall back to vanilla. */
export const SCHEME_STEP_CATALOGS: Record<string, SchemeStepDef[]> = {
  PMEGP: PMEGP_STEPS,
  MUDRA: MUDRA_STEPS,
  STANDUP: STANDUP_STEPS,
  PMFME: PMFME_STEPS,
  PMEGP_2ND: PMEGP_2ND_STEPS,
  SCLCSS: SCLCSS_STEPS,
  ...Object.fromEntries([...SHORT_CERT_CODES].map((c) => [c, SHORT_CERT_STEPS])),
  ...Object.fromEntries([...SHORT_WC_CODES].map((c) => [c, SHORT_WC_STEPS])),
  ...Object.fromEntries([...FULL_MINUS_LATE_CODES].map((c) => [c, FULL_MINUS_LATE])),
};

export function getSchemeSteps(schemeCode?: string | null): SchemeStepDef[] {
  if (!schemeCode) return VANILLA_STEPS;
  return SCHEME_STEP_CATALOGS[schemeCode] || VANILLA_STEPS;
}

export function getSchemeStepCount(schemeCode?: string | null): number {
  return getSchemeSteps(schemeCode).length;
}

export function getStepDef(
  schemeCode: string | null | undefined,
  localStep: number
): SchemeStepDef | undefined {
  return getSchemeSteps(schemeCode).find((s) => s.n === localStep);
}

/** Local UI step → store/AI content bucket. */
export function localToContent(
  schemeCode: string | null | undefined,
  localStep: number
): number {
  return getStepDef(schemeCode, localStep)?.contentStep ?? localStep;
}

/** Content bucket → local UI step (if that content is in the scheme catalog). */
export function contentToLocal(
  schemeCode: string | null | undefined,
  contentStep: number
): number | undefined {
  return getSchemeSteps(schemeCode).find((s) => s.contentStep === contentStep)?.n;
}

/** Last local step (usually uploads). */
export function getLastLocalStep(schemeCode?: string | null): number {
  const steps = getSchemeSteps(schemeCode);
  return steps[steps.length - 1]?.n ?? 1;
}

export function isUploadsLocalStep(
  schemeCode: string | null | undefined,
  localStep: number
): boolean {
  const def = getStepDef(schemeCode, localStep);
  return def?.id === 'uploads' || def?.contentStep === 18;
}
