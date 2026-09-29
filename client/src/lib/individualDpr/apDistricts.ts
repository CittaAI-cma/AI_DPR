/**
 * Andhra Pradesh districts (26) for Create New Latest DPR cover step.
 * Official post-2022 AP district set.
 */
export const AP_DISTRICTS: readonly string[] = [
  'Alluri Sitharama Raju',
  'Anakapalli',
  'Ananthapuramu',
  'Annamayya',
  'Bapatla',
  'Chittoor',
  'Dr. B.R. Ambedkar Konaseema',
  'East Godavari',
  'Eluru',
  'Guntur',
  'Kakinada',
  'Krishna',
  'Kurnool',
  'Nandyal',
  'NTR',
  'Palnadu',
  'Parvathipuram Manyam',
  'Prakasam',
  'Sri Potti Sriramulu Nellore',
  'Sri Sathya Sai',
  'Srikakulam',
  'Tirupati',
  'Visakhapatnam',
  'Vizianagaram',
  'West Godavari',
  'YSR Kadapa',
] as const;

/** Options for the district select; keeps a legacy free-text value if not in the list. */
export function districtSelectOptions(current?: string | null): string[] {
  const cur = String(current || '').trim();
  if (cur && !AP_DISTRICTS.includes(cur as (typeof AP_DISTRICTS)[number])) {
    return [cur, ...AP_DISTRICTS];
  }
  return [...AP_DISTRICTS];
}
