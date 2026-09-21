# Scheme Finder (Venture Match) — Business Logic

> Latest product rules as implemented in the codebase.  
> Primary route: `/venture-match`  
> UI label: **Scheme Finder**

**Maintenance:** Any business-logic change to Scheme Finder / Venture Match must update this file (Cursor rule: `.cursor/rules/venture-match-docs.mdc`). If the handoff or link to Individual DPR changes, update [create-new-dpr-business-logic.md](./create-new-dpr-business-logic.md) too.

Related doc: [Create New Latest DPR business logic](./create-new-dpr-business-logic.md)

---

## 1. Purpose

Scheme Finder asks a **dynamic set of questions** (base 14 + up to 5 conditional) and ranks which MSME schemes still fit. Matching runs **on the client** (deterministic rules). An optional hybrid help chat can suggest an option using AP-oriented chips first, then an LLM fallback.

It does **not** create the DPR itself. It hands answers + matches into **Create New Latest DPR** (Individual DPR), or redirects **cluster** matches to Cluster DPR.

**Rev 2 (AP MSME One integration):** Conditional questions `supportType`, `upgradeIntent`, `qualityGoal`, `sectorFlag`, `procurementInterest`; new scheme codes including `PMEGP_2ND`, `SCLCSS` (not general CLCSS), short overlays (`ZED`/`LEAN`/`PMS`/…), CTA-only (`CHAMPIONS`/`ESDP`/`NTCEC`), and cluster CTAs (`MSE_CDP`/`SFURTI`/`AP_CDP`/`APICF`). See [ap-msme-one-schemes-gap.pdf](./ap-msme-one-schemes-gap.pdf).

---

## 2. How this links to Create New Latest DPR

| Step | What happens |
|------|----------------|
| User finishes visible questions | `evaluate(answers)` builds `matches` + `excluded` (each match has `dprRoute`) |
| **Generate DPR for this Match** (`full` / `short`) | `saveHandoff` → `/individual-dpr/create?new=true&scheme=<CODE>` |
| **Open Cluster DPR** (`dprRoute=cluster`) | Navigate to `/cluster-dpr/create` |
| CTA-only matches | No individual DPR button — helpdesk / training hint only |
| **Create DPR** (generic button) | Same handoff → `/individual-dpr/create?new=true` |
| Handoff storage | `localStorage` key `venture-match-handoff` (`HANDOFF_KEY`) |
| Progress storage | `localStorage` key `venture-match-progress` (`STORAGE_KEY`) — wizard resume only |

On Individual DPR open with `?new=true`:

1. Page **peeks** the handoff (`peekHandoff`) — does not delete it.
2. Sets `matchedSchemeCode` from `?scheme=` if present.
3. Stores `ventureMatchAnswers` from handoff.
4. Prefills step fields via `prefillFromVentureMatch(answers)`.

So Scheme Finder is the **eligibility + scheme choice front door**; Create New DPR is the **18-step bank-ready report** that consumes that choice.

There is also a separate path: AI Guided Builder (`/dpr/builder`) can **consume** the same handoff via `consumeHandoff()` + `buildDprPrefill()`. Create New Latest DPR is the primary Scheme Finder CTA today.

---

## 3. Question flow (14 cards)

Order is fixed in `client/src/lib/ventureMatch/questions.ts`:

| # | `questionId` | Multi? | Option IDs (summary) |
|---|--------------|--------|----------------------|
| 1 | `activity` | no | `mfg`, `knowledge`, `food`, `craft`, `service`, `trade`, `vending`, `crop`, `mixed`, `notSure`, `notBusiness` |
| 2 | `stage` | no | `greenfield`, `brownfield`, `idea`, `restart`, `notSure` |
| 3 | `budget` | no | bands `under2L` … `above10Cr`, plus `none`, `notSure` |
| 4 | `legal` | no | `sole`, `partnership`, `company`, `unregistered`, `otherEntity`, `notSure` |
| 5 | `owner` | **yes** | Combinable: `female`, `sc`, `st`, `bc`, `pwd`, `transgender`, `exServiceman`. Exclusive (alone): `generalMale`, `notDecided`, `noMajority`, `notSure` |
| 6 | `domicile` | no | `ap`, `other`, `planningAp`, `notSure` |
| 7 | `location` | no | `urban`, `rural`, `apiic`, `home`, `outsideAp`, `notDecided` |
| 8 | `riceCard` | no | `yes`, `no`, `otherCard`, `notSure` |
| 9 | `age` | no | `under18`, `18to20`, `21to50`, `51to60`, `above60`, `notSure` |
| 10 | `education` | no | `below8th`, `8thPlus`, `notSure` |
| 11 | `udyam` | no | `yes`, `willing`, `applied`, `refuse`, `notSure` |
| 12 | `priorSubsidy` | no | `none`, `repaid`, `outstanding`, `notSure` |
| 13 | `govtFamily` | no | `yes`, `no`, `notSure` |
| 14 | `market` | no | `offline`, `ecommerce`, `export`, `both`, `notSellingYet`, `notSure` |

### Owner tag rules

- Combinable tags can be multi-selected.
- Exclusive tags (`OWNER_EXCLUSIVE_TAGS`) clear other tags and cannot mix with them.
- Selecting an exclusive tag while another exclusive is selected replaces it.

### Global block

If `activity` is `notBusiness` or `notSure`, **all schemes fail** (`blocksAllSchemes`). Remaining count becomes 0.

---

## 4. Evaluation engine

File: `client/src/lib/ventureMatch/evaluate.ts`  
Rules: `client/src/lib/ventureMatch/schemes.ts`

For each scheme criterion:

- `pass` — answer present and allowed  
- `fail` — answer present and not allowed  
- `unknown` — answer missing / not yet asked  

Scheme classification:

- Any criterion `fail` → **excluded**
- Else if at least one `pass` → **match** (unknowns allowed)
- Else (all unknown) → neither listed as match nor as excluded with fails only in step view

**Remaining count** while answering question N ignores the current and later answers (`scopedAnswers`), so the counter only reflects decisions already locked in.

**Step exclusions** UI shows schemes that newly fail given answers up to the previous step.

Benefit copy is an i18n key from `scheme.benefit(answers)` (e.g. PMEGP rural/special rates, CMEP booster text).

---

## 5. Catalog (16 schemes)

| Code | Kind | AP domicile required? | Headline gates (simplified) |
|------|------|----------------------|-----------------------------|
| `SVANIDHI` | loan | no | Street vending + urban + age 18+ |
| `VISHWAKARMA` | subsidy | no | Craft + age 18+ + no outstanding subsidy + no govt family |
| `PMFME` | subsidy | no | Food + budget ≤ ~₹50L bands + sole/partnership/otherEntity + 8th+ |
| `PMEGP` | subsidy | no | Greenfield (idea = unknown) + enterprise activity + registered firm + numeric budget + education gate if large |
| `STANDUP` | loan | no | Enterprise + registered + greenfield + woman/SC/ST + ₹10L–₹1Cr + 18+ + Udyam ready |
| `MUDRA` | loan | no | Enterprise + registered + budget ≤ ₹20L band + 18+ + Udyam ready |
| `CGTMSE` | guarantee | no | Registered + Udyam ready + budget &lt; ₹10Cr bands + enterprise |
| `AP_EDP` | subsidy | **yes** | Manufacturing + greenfield + AP unit location (urban/rural/apiic) + registered + Udyam + budget |
| `AP_FPP` | subsidy | **yes** | Food + legal incl. company/otherEntity + AP location + Udyam |
| `AP_TECH_UPGRADE` | subsidy | **yes** | Manufacturing + brownfield/restart + AP location + registered |
| `MSE_SPICE` | subsidy | no | Registered + brownfield/restart + Udyam |
| `OBMMS` | subsidy | **yes** | SC/ST/BC/PWD + white rice card + age 21–60 + stage not idea-only + budget + AP location + unregistered/sole |
| `AP_PARKS` | subsidy | **yes** | Location = APIIC park + registered |
| `AP_CMEP` | subsidy | **yes** | Activity `mfg` or `knowledge` + greenfield + numeric budget (loan required; `none` fails) |
| `RAMP_TEAM` | support | no | Registered + ecommerce/both + Udyam |
| `EPM_NIRYAT` | subsidy | no | Registered + export market + Udyam |

### Shared activity buckets (matcher)

- Manufacturing-like: `mfg`, `food`, `craft`
- Service-like: `service`, `trade`, `vending`, `knowledge`
- Enterprise activities (most central schemes): mfg, knowledge, food, craft, service, trade, vending, mixed

### PMEGP education gate

If manufacturing-like and budget min ≥ ₹10L, or service-like/mixed and budget min ≥ ₹5L → need `education === '8thPlus'`. Below threshold → pass without education.

### AP special-category boost (EDP / FPP benefit text)

`domicile === 'ap'` AND owner includes one of `female | sc | st | bc | pwd` → boosted benefit string.

### AP CMEP booster (match flag + UI banner)

`boosted` is set **only** for `AP_CMEP` when:

```text
domicile === 'ap'
AND owner has at least one of: female | transgender | exServiceman | pwd
```

Results card shows a booster banner when `scheme.boosted` is true.

### Ownership hint

If owner includes `generalMale` and not `female`, results show a hint about putting the firm in wife/mother’s name (Stand-Up India / higher subsidy / CGTMSE / RAMP TEAM messaging).

---

## 6. Help chat (hybrid)

- UI: `VentureMatchHelpBubble` + trigger on each card.
- Guides: `helpGuides.ts` — AP-rule notes + clarifying chip trees; maps replies → option ID(s).
- Multi only for `owner`.
- Free text → `POST /api/ai/...` → `ventureMatchHelp.service` (server LLM).
- Chat has its own EN | తెలుగు toggle (does not have to change whole-app language).
- Applying a suggestion writes the option and advances like a normal selection.

---

## 7. Results actions

Per matched scheme:

- Show name + benefit i18n string.
- CMEP booster banner if `boosted`.
- Button → `onCreateDprForScheme(code)`.

Footer:

- **Create DPR** → Individual DPR without forced scheme code.
- **Start again** → clears answers + `venture-match-progress`.

---

## 8. Key source files

| File | Role |
|------|------|
| `client/src/pages/VentureMatch.tsx` | Wizard, storage, navigation to DPR |
| `client/src/lib/ventureMatch/questions.ts` | Question order + storage keys |
| `client/src/lib/ventureMatch/schemes.ts` | 16 scheme rules + CMEP booster |
| `client/src/lib/ventureMatch/evaluate.ts` | Match / exclude / remaining |
| `client/src/lib/ventureMatch/mapToDpr.ts` | Handoff + classic-builder prefill helper |
| `client/src/lib/ventureMatch/helpGuides.ts` | Chip trees |
| `server/src/services/ventureMatchHelp.service.ts` | LLM help fallback |
| `client/src/i18n/locales/en.json` / `te.json` | Scheme names, criteria, benefits |

---

## 9. Non-goals / boundaries

- Does not submit applications to banks or AP MSME ONE.
- Does not invent live subsidy percentages beyond coded benefit strings; Create New DPR scheme briefs hold brochure-style copy separately.
- Central schemes are **not** gated on AP domicile; only listed AP state schemes (incl. CMEP) are.
