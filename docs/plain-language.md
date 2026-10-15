# Plain-language intake

Goal: a non-technical MSME owner can fill the Create DPR form without any outside glossary, in English or Telugu.

## What the person sees

- **Under each step heading:** one plain sentence on what the step asks and why (`STEP_INTROS`).
- **For each question:** the plain question first, the official label in brackets (so it still matches bank and government forms), then small text with what it means, an example answer, the unit, and where relevant where to find it. Upload fields say what the paper is and where to get it.
- **Units are explained automatically** (`lib/plainLanguage/units.ts`): ₹ Lakhs ("1 lakh is ₹1,00,000, type 2.5 for ₹2,50,000"), %, sq.ft, years, kWh, counts, optional.
- **Technical words are explained automatically** (`lib/plainLanguage/glossary.ts`, about 50 entries: working capital, FCI, margin money, DSCR, moratorium, CFE/CFO, UPI, ODOP, FSSAI, HSN, SC/ST ...) for any label that has no hand-written wording, so a new field is never left unexplained.
- **The (i) tooltips** (`data/fieldDescriptions.ts`) were rewritten in plain words too.

## Where it lives

- `lib/plainLanguage/prompts/*.ts`: `PROMPTS` (`{ask, help?, example?}` keyed by the exact label) and `STEP_INTROS` (keyed by step title without "Step N:"). Add a file here and it is picked up automatically.
- `lib/plainLanguage/describe.ts`: pure function that combines prompt, unit hint and glossary terms (unit tested).
- `components/ui/FieldPrompt.tsx`: `FieldPrompt`, `FieldHelp`, `StepIntro`. Every form label in `components/individual-dpr` goes through it.
- Telugu: `lib/i18n/te/plain*Te.ts`, keyed by the English sentence.

## Keeping it complete

- `npm run audit:i18n` fails if any prompt, intro, glossary meaning, unit hint, tooltip or `FieldPrompt` label has no Telugu line.
- In `npm run dev`, `window.__plainMissing` (browser console) lists labels shown on the screens you visited that have no plain wording yet; `window.__tfMissing` lists untranslated strings.
- Tests check that wording never promises an outcome ("guaranteed", "you will get"), that nothing asks for a personal PAN or Aadhaar number, and that common steps have an intro.
- A native Telugu speaker should read the Telugu once before release.
