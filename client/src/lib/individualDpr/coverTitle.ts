import { getSchemeBrief, briefText } from '@/lib/individualDpr/schemeBriefs';

const UPGRADE_SCHEMES = new Set([
  'PMEGP_2ND',
  'SCLCSS',
  'AP_TECH_UPGRADE',
  'MSE_GIFT',
  'PTUAS',
  'MSE_SPICE',
]);

export interface CoverTitleInput {
  clusterName?: string;
  unitName?: string;
  natureOfBusiness?: string;
  majorProducts?: string;
  district?: string;
  location?: string;
  craft?: string;
}

export interface IndividualCoverLines {
  actionLine: string;
  unitName: string;
  underLine: string;
}

/** Short scheme label for the cover “under …” line. */
export function schemeCoverLabel(schemeCode: string | null | undefined, lang: 'en' | 'te' = 'en'): string {
  if (!schemeCode) return lang === 'te' ? 'బ్యాంకు టర్మ్ లోన్' : 'Bank Term Loan';
  const brief = getSchemeBrief(schemeCode);
  const title = briefText(brief.title, lang);
  // Prefer a compact label: strip parenthetical tails when very long
  if (title.length > 72) {
    const cut = title.indexOf('(');
    if (cut > 10) return title.slice(0, cut).trim();
  }
  return title || schemeCode;
}

export function individualActionLine(schemeCode: string | null | undefined): string {
  if (schemeCode && UPGRADE_SCHEMES.has(schemeCode)) return 'Upgradation of';
  if (schemeCode === 'ECLGS') return 'Working Capital Proposal for';
  if (schemeCode === 'ZED' || schemeCode === 'LEAN' || schemeCode === 'MSME_IPR') {
    return 'Proposal for';
  }
  if (schemeCode === 'PMS') return 'Marketing Support Proposal for';
  return 'Establishment of';
}

export function getIndividualCoverLines(
  step1: CoverTitleInput,
  schemeCode: string | null | undefined,
  lang: 'en' | 'te' = 'en'
): IndividualCoverLines {
  const unitName = (step1.unitName || step1.clusterName || 'UNIT NAME').trim();
  return {
    actionLine: individualActionLine(schemeCode),
    unitName,
    underLine: `under '${schemeCoverLabel(schemeCode, lang)}'`,
  };
}

/**
 * Deterministic unit / project title suggestion for step 1.
 * Requires nature of business + major products (caller should gate).
 */
export function suggestUnitTitle(
  step1: CoverTitleInput,
  schemeExtras?: { craft?: string } | null
): string {
  const craft = (schemeExtras?.craft || step1.craft || '').trim();
  const nature = (step1.natureOfBusiness || '').trim();
  const products = (step1.majorProducts || '').trim();
  const place = (step1.district || step1.location || '').trim();

  const firstProduct = products.split(/[,;/]/)[0].trim();
  let core = '';

  if (nature && firstProduct) {
    const natureHasUnit = /unit|enterprise|project|works|factory|plant/i.test(nature);
    const productAlreadyInNature = nature.toLowerCase().includes(firstProduct.toLowerCase());
    if (productAlreadyInNature) {
      core = natureHasUnit ? nature : `${nature} Unit`;
    } else {
      core = natureHasUnit ? `${nature} (${firstProduct})` : `${nature} — ${firstProduct} Unit`;
    }
  } else if (craft) {
    core = `${craft} Unit`;
  } else if (nature) {
    core = /unit|enterprise|project|works|factory|plant/i.test(nature) ? nature : `${nature} Unit`;
  } else if (firstProduct) {
    core = `${firstProduct} Unit`;
  } else {
    core = 'MSME Unit';
  }

  core = core
    .split(/\s+/)
    .map((w) => (w === w.toUpperCase() && w.length <= 5 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (place && !core.toLowerCase().includes(place.toLowerCase())) {
    return `${core}, ${place}`;
  }
  return core;
}
