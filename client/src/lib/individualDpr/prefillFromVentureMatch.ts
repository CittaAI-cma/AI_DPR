import { VentureMatchAnswers } from '@/lib/ventureMatch/types';

/**
 * Create New Latest DPR does **not** prefill form fields from Scheme Finder.
 * Kept as a no-op so callers / docs do not accidentally reintroduce filled blanks.
 * Overlay rules still read `ventureMatchAnswers` from the store (budget, owner, activity).
 */
export function prefillFromVentureMatch(_answers: VentureMatchAnswers) {
  return {};
}
