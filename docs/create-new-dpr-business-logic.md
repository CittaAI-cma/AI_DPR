# Create New Latest DPR (Individual DPR) — Business Logic

> Latest product rules as implemented in the codebase.  
> Primary route: `/individual-dpr/create`  
> UI title i18n: **Create New Latest DPR**

**Maintenance:** Any business-logic change to Create New Latest DPR / Individual DPR must update this file (Cursor rule: `.cursor/rules/create-new-dpr-docs.mdc`). If the handoff or link to Scheme Finder changes, update [venture-match-business-logic.md](./venture-match-business-logic.md) too.

Related doc: [Scheme Finder (Venture Match) business logic](./venture-match-business-logic.md)

---

## 1. Purpose

Create New Latest DPR builds a **single-unit / individual enterprise** Detailed Project Report. **Each scheme owns its own consecutive step list** (Step 1…N) via `schemeStepCatalog.ts`. Vanilla uses 18 steps; PMEGP uses 14; MUDRA uses 12; short packs (ZED etc.) use 5; etc. It reuses shared draft/generate/preview services via `toIndividualPayload` (legacy wire keys remain for compatibility), and applies scheme-specific fields / uploads.

Users can:

- Arrive from **Scheme Finder** with answers + a scheme code, or  
- Start vanilla (`?new=true`) and pick a scheme from the dropdown, or  
- Leave scheme empty → **vanilla bank term loan** path.

---

## 2. How this links to Scheme Finder (Venture Match)

| Link | Direction | Detail |
|------|-----------|--------|
| Entry from Scheme Finder | VM → DPR | `saveHandoff` then navigate to `/individual-dpr/create?new=true` or `...?scheme=<CODE>` |
| Handoff key | shared | `localStorage` `venture-match-handoff` |
| On `?new=true` load | DPR reads VM | `peekHandoff()` → `setVentureMatchAnswers` (for overlay rules only), optional `setMatchedSchemeCode` from query. **No form-field prefill.** |
| Scheme list | shared catalog | Dropdown / picker = `SCHEMES` filtered by `isIndividualPickerScheme` (+ empty vanilla option) |
| Runtime use of VM answers | DPR reads VM | Step 18 uploads / PMEGP caste cert / MUDRA Tarun Plus / MUDRA Shishu–Kishore / PMEGP education gate use `data.ventureMatchAnswers` |
| Form impact copy | DPR only | `getSchemeImpact(code)` explains how the **form** changes — not eligibility matching |
| Scheme brochure | DPR only | `SchemeBriefPanel` + `schemeBriefs/*` — Benefits / Eligibility / How to Apply / Documents / FAQs (EN/TE) |

Scheme Finder decides **which schemes fit**. Create New DPR decides **how the DPR form and documents behave for the selected scheme**, and drafts the report.

Changing the scheme dropdown mid-flow updates `matchedSchemeCode`, visible steps, briefs, and extras; it does **not** re-run the Scheme Finder evaluator.

---

## 3. Entry & lifecycle

### New draft

`/individual-dpr/create?new=true` (± `&scheme=CODE`)

1. `resetData()`, clear project/DPR ids.  
2. Peek Venture Match handoff if present (store answers for overlay rules only — uploads, MUDRA bands, education gate).  
3. Set scheme from query string (may be null).  
4. **Do not** prefill any form step fields from Scheme Finder.  
5. Force `currentStep = 1`, clear loading.
6. **Setup phases (UI):**
   - No `scheme` in URL → **pick** (scheme cards grid).  
   - `?scheme=CODE` (e.g. from Scheme Finder) → **brief** (description box for that scheme).  
   - Tap a card → **brief** for that scheme.  
   - **Next** on brief → **form** (step strip + live preview).  
   - Resume with `projectId` → **form** directly.

### Resume / load

`?projectId=` / `?dprId=` loads project + cluster draft into `individualDPRStore`.

### Persist

Drafts save via cluster DPR draft API using `toClusterPayload(data)`:

- `isIndividualDPR: true`
- `matchedSchemeCode` on root + `metadata`
- Step 1 maps `unitName` → `clusterName` if needed
- Step 11 maps applicant → SPV-style fields for shared renderer

URL may be rewritten to include `projectId`, `dprId`, and `&scheme=` when present.

### Generate

User must be on the **last visible** step. Generate uses the same adapted payload to produce the bilingual document shown in `ClusterDPRDocumentView`.

---

## 4. Step model

Base skeleton: **steps 1–18** (`getStepTitle` / i18n `individualDpr.steps.*`).

| Step | Intent |
|------|--------|
| 1 | Unit basic details (+ scheme extras when configured) |
| 2 | Sector overview |
| 3 | District & location |
| 4 | Unit profile |
| 5 | Value chain |
| 6 | Market |
| 7 | Gaps |
| 8 | SWOT |
| 9 | Planned activities |
| 10 | Workplace / shed |
| 11 | Applicant / firm |
| 12 | Project cost |
| 13 | Means of finance |
| 14 | Operating cost & sales |
| 15 | Financial viability |
| 16 | Implementation schedule |
| 17 | Expected impact |
| 18 | Document uploads |

### Per-scheme step catalogs

Configured in `client/src/lib/individualDpr/schemeStepCatalog.ts`. UI shows consecutive **Step 1…N** for the selected scheme. Internally each step maps to a `contentStep` store/AI/PDF bucket so generation stays compatible.

| Scheme | Step count (UI) | Notes |
|--------|-----------------|--------|
| Vanilla / most full schemes | 18 | `VANILLA_STEPS` |
| `PMEGP` | **14** | Bank-unit catalog — see [pmegp.md](./schemes/PMEGP/pmegp.md) |
| `MUDRA` | **12** | PMMY bank-unit catalog — see [mudra.md](./schemes/MUDRA/mudra.md) |
| `VISHWAKARMA` / `SVANIDHI` / `NHDP` / `ASPIRE` | 15 | Full bank minus late viability/schedule/impact |
| `ZED` / `LEAN` / `MSME_IPR` / `PMS` / `SCST_HUB` | 5 | Short cert / consulting pack |
| `ECLGS` | 7 | Working-capital pack |

`getVisibleSteps(code)` returns `[1..N]` for that scheme and drives the step strip and next/prev navigation.

---

## 5. Scheme overlay (`matchedSchemeCode`)

Configured in `client/src/lib/individualDpr/schemeFormConfig.ts`.

### Extra fields on step 1 (`schemeExtras`)

| Scheme | Extra fields |
|--------|----------------|
| `VISHWAKARMA` | `craft`, `currentTools`, `newTools` (craft list = 18 Vishwakarma trades) |
| `SVANIDHI` | `covOrLor`, `upiQr` |
| `PMFME` | Own 14-step food-unit pack — see [docs/schemes/PMFME/pmfme.md](./schemes/PMFME/pmfme.md), `pmfmeQuestions.ts`, `PMFME_STEPS` (NIFTEM model structure: FSSAI, new/existing, ODOP, RM sources, 35% grant cap ₹10 L). |
| `AP_EDP` | `apiicPark` (land-rebate hint) |
| `PMEGP` | Full bank-unit set — see [docs/schemes/PMEGP/pmegp.md](./schemes/PMEGP/pmegp.md), `pmegpQuestions.ts`, and `PMEGP_STEPS` (14 consecutive steps: category, rural/urban, agency, entrepreneur, process, capacity, margin-money %). |
| `MUDRA` | Own 12-step PMMY pack — see [docs/schemes/MUDRA/mudra.md](./schemes/MUDRA/mudra.md), `mudraQuestions.ts`, `MUDRA_STEPS` (Shishu/Kishore/Tarun/Tarun Plus, own+bank MoF, shop proof uploads). |
| `STANDUP` | Own 13-step bank-unit pack — see [docs/schemes/STANDUP/standup.md](./schemes/STANDUP/standup.md), `standupQuestions.ts`, `STANDUP_STEPS` (woman/SC/ST, ≥51% stake, ≥10% own, composite TL+WC, competitors + schedule). |
| `PMEGP_2ND` | Own 14-step upgrade pack — see [docs/schemes/PMEGP_2ND/pmegp2nd.md](./schemes/PMEGP_2ND/pmegp2nd.md), `pmegp2ndQuestions.ts`, `PMEGP_2ND_STEPS` (prior PMEGP/REGP/MUDRA, uniform 15% MM / 10% own, brownfield only). |
| `SCLCSS` | Own 13-step tech-upgrade pack — see [docs/schemes/SCLCSS/sclcss.md](./schemes/SCLCSS/sclcss.md), `sclcssQuestions.ts`, `SCLCSS_STEPS` (SC/ST ≥51%, existing vs proposed tech, 25% subsidy cap ₹25 L). |
| `AP_TECH_UPGRADE` | Own 13-step brownfield pack — see [docs/schemes/AP_TECH_UPGRADE/apTechUpgrade.md](./schemes/AP_TECH_UPGRADE/apTechUpgrade.md), `apTechUpgradeQuestions.ts`, `AP_TECH_UPGRADE_STEPS` (MSME-EDP 4.0 para 6.4: 20%/40%/30% of FCI by size & special category). |
| `MSE_GIFT` | `energyBaselineKwh`, `expectedSaving` |
| `ZED` / `LEAN` / `MSME_IPR` / `PMS` / … | short-pack fields (see `SCHEME_EXTRA_FIELDS`) |
| Cluster / CTA schemes (`MSE_CDP`, `SFURTI`, `AP_CDP`, `APICF`, `CHAMPIONS`, `ESDP`, `NTCEC`) | **Excluded** from Create New Latest DPR picker (`isIndividualPickerScheme`) |

**Policy:** Do not implement general `CLCSS` — use `SCLCSS` (SC/ST only) + `AP_TECH_UPGRADE` for general category. Each scheme defines its own step catalog in `schemeStepCatalog.ts` (not hide-from-18). PMEGP uses the KVIC unit DPR question set in `docs/schemes/PMEGP/pmegp.md`.

AI suggestions / fill-all pass `_schemeCode` and can infer missing extras.

### Step 12 / 15 behaviour (MUDRA + budget from Venture Match)

If scheme is `MUDRA` and Venture Match budget is `under2L` or `2to5L` (Shishu/Kishore):

- Hide complex capex tables (land / building / utilities / pre-op) on step 12.
- Step 15 can show **Nayak working capital**: limit = 20% of turnover, margin = 5% of that limit.

### DSCR

Shown when bank loan (lakhs) &gt; 0 (`showDscr`).

### PMEGP education gate (upload)

If scheme is `PMEGP` or `PMEGP_2ND` and project cost (lakhs) exceeds:

- Manufacturing-like activity (`mfg` / `food` / `craft`) → **&gt; 10**  
- Service-like (`service` / `knowledge` / `trade` / `vending` / `mixed`) → **&gt; 5**  

…then step 18 expects an 8th-pass education upload (gate helper `showPmegpEducationGate`). Activity for this check comes from Venture Match answers when available.

### Step 18 uploads (scheme-specific)

| Scheme | Uploads |
|--------|---------|
| `VISHWAKARMA` | Aadhaar, savings passbook, ration card |
| `SVANIDHI` | CoV or LoR |
| `PMFME` | Machinery quotes, premises lease, draft FSSAI |
| `PMEGP` | Machinery quotes, building estimate; + caste certificate if VM owner has sc/st/bc |
| `AP_EDP` | Land/shed allotment, CFE/CFO, CA FCI statement |
| `MUDRA` | Shop proof, bank statements, quotes; + Mudra closure if Tarun Plus bands (`50Lto1Cr`+) |
| Default / vanilla | Aadhaar/PAN, Udyam, passbook, machinery quotations |

---

## 6. Scheme pick → brief → form

- **Form header:** scheme **dropdown** (`SCHEME_OPTIONS`) switches `matchedSchemeCode` without leaving the form; selected scheme name is shown under the page title.  
- Yellow scheme-impact bar shows from **step 1** onward (scheme name + how steps/uploads change).

**Pick:** `SchemePickerGrid` shows all `SCHEME_OPTIONS` (vanilla + every scheme) as cards (title, intro, category/type chips).

**Brief:** Tapping a card (or arriving with `?scheme=`) opens `SchemeBriefPanel`:

- Intro  
- Tabs: **Benefits / Eligibility / How to Apply / Documents / FAQs**  
- Sidebar **Quick Info**: Ministry, Category, Type, Status  
- EN/TE from page language  
- Footer **form notes** from `getSchemeImpact` (how the DPR steps change)  
- **Next** continues to the form steps; **All schemes** returns to the grid

Data packs:

- `lib/individualDpr/schemeBriefs/central.ts` — central schemes + vanilla  
- `lib/individualDpr/schemeBriefs/ap.ts` — AP schemes incl. CMEP  
- Lookup: `getSchemeBrief(code)`  

---

## 7. Prefill from Scheme Finder

**Disabled.** Create New Latest DPR leaves all step fields blank on `?new=true`.

- Scheme Finder may still set `matchedSchemeCode` via `?scheme=` and store `ventureMatchAnswers` for **overlay rules only** (e.g. step-18 caste cert, MUDRA Shishu/Kishore hide-capex, PMEGP education gate).
- `prefillFromVentureMatch` is a no-op and must not write nature of business, district, costs, or other form values.
- AI Guided Builder (`/dpr/builder`) may still use its own handoff prefill — that path is separate.

---

## 8. AI assist

- Per-step **AISuggestions** (shared with cluster), scoped with `_schemeCode` when individual.  
- **Fill all steps with AI** (`fillAllStepsWithAi`) walks the scheme catalog (skips uploads), uses each step’s `contentStep` for AI/store, respects hidden capex for MUDRA Shishu/Kishore, and infers scheme extras.  
- User must still review before generate.

### Live preview scroll-to-field hits

On **Create New Latest DPR** only (`IndividualDPRCreation` split/preview pane):

- When step / `schemeExtras` values change (typing, AI apply, fill-all), the live `ClusterDPRDocumentView` scrolls to the **first** tagged occurrence of those fields (`data-dpr-field`).
- If the same change appears in **multiple** places, **Up** / **Down** buttons cycle hits in document order; **Up** hides on the first hit, **Down** hides on the last.
- Cluster create and saved DPR preview pages do not use this navigator.

---

## 9. State ownership

`client/src/store/individualDPRStore.ts` holds:

- `step1` … `step18`  
- `matchedSchemeCode`  
- `ventureMatchAnswers`  
- `schemeExtras`  
- `currentStep`, project/DPR ids, generated document  

UI page: `IndividualDPRCreation.tsx`  
Form: `IndividualDPRForm.tsx`

---

## 10. Key source files

| File | Role |
|------|------|
| `client/src/pages/IndividualDPRCreation.tsx` | Route shell, pick/brief/form phases, save/generate |
| `client/src/components/individual-dpr/SchemePickerGrid.tsx` | Scheme card grid |
| `client/src/components/individual-dpr/IndividualDPRForm.tsx` | Step fields + AI |
| `client/src/components/individual-dpr/SchemeBriefPanel.tsx` | Scheme brochure UI |
| `client/src/lib/individualDpr/schemeFormConfig.ts` | Overlay rules, uploads, impact copy |
| `client/src/lib/individualDpr/schemeBriefs/*` | Brochure content EN/TE |
| `client/src/lib/individualDpr/prefillFromVentureMatch.ts` | No-op (form prefill disabled) |
| `client/src/lib/individualDpr/toClusterPayload.ts` | Adapter to cluster APIs |
| `client/src/lib/individualDpr/previewFieldHits.ts` | Live preview field-diff + scroll helpers |
| `client/src/lib/ventureMatch/schemes.ts` | Scheme codes listed in dropdown |
| `client/src/lib/ventureMatch/mapToDpr.ts` | Handoff peek/save (shared with Scheme Finder) |

---

## 11. Boundaries

- Eligibility matching stays in Scheme Finder; this page trusts `matchedSchemeCode` (or vanilla).  
- Brochure text is a drafting aid — confirm live GOs / ceilings with the agency.  
- Cluster DPR (`/cluster-dpr/create`) is a separate multi-unit flow; this doc is **individual only**.
