# AP MSME-EDP 4.0 (new-unit capital subsidy) — Detailed Project Report format & form questions

> Scheme code: `AP_EDP`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from **Andhra Pradesh MSME & Entrepreneur Development Policy 4.0 (2024–29)** — Capital Subsidy (**para 6.3**) and the notified amendment table (APIIC / Industries).

**Related app files:** `schemeStepCatalog.ts` (`AP_EDP_STEPS`), `apEdpQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

AP MSME-EDP 4.0 **capital subsidy** is a **state incentive on Fixed Capital Investment (FCI)** for **new (greenfield) manufacturing enterprises** in Andhra Pradesh — **not** the technology-upgradation incentive for existing units (`AP_TECH_UPGRADE`).

Approved-style packs are:

- **Greenfield-first** (new unit; CoD / first invoice triggers instalments)
- **FCI-numbers-first** (land + building + P&M + eligible FCI)
- **Size × category-first** (micro / small / medium × general / special)
- Mutually exclusive from tech-upgrade subsidy on the same FCI
- Free of multi-unit CFC / SPV grids

**Policy:** Food processing usually uses `AP_FPP` (do not double-claim the same capital subsidy). Brownfield tech upgrade uses `AP_TECH_UPGRADE`. Combined incentives under the policy ≤ **75% of FCI**.

Create New Latest DPR uses its **own 13 consecutive steps** for `AP_EDP`.

---

## 2. Reference policy / portals (URLs)

PDFs are not stored in-repo (download from these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | AP MSME One — policies hub | https://apmsmeone.ap.gov.in/MSMEONE/Public/Policies.aspx | Policy entry / apply channel |
| 2 | MSME-EDP 4.0 amendment (capital subsidy table) | https://apiic.in/wp-content/themes/custom-theme/assets/Pdfs/MSME2024-29%20Amendment.pdf | Para 6.3 rates, caps, instalments; **new enterprises only** |
| 3 | G.O.Ms.No.69 (policy notification) | https://apiic.in/wp-content/uploads/2024/12/GOMS-NO-69.pdf | Capital subsidy ↔ tech upgrade mutually exclusive; ≤ 75% FCI |
| 4 | Operational guidelines (Feb 2025 — G.O.Ms.No.28 context) | Confirm on AP MSME One / DIC | Sanction / claim process |

**Note:** There is **no** public library of filled sample DPRs for this incentive. Shape = policy FCI tables + bank / DIC appraisal pack (project cost, MoF, capacity, CA FCI).

---

## 3. Product rules (quick reference)

From the **amendment** reading of para 6.3 (confirm live GO / GM-DIC before locking):

| Category | Micro | Small | Medium |
|----------|-------|-------|--------|
| **General** | **25%** of FCI, cap **₹25 L**, 2 annual instalments after CoD / 1st invoice | **25%** of FCI, cap **₹1.5 Cr**, 3 annual instalments | **25%** of FCI, cap **₹7 Cr**, 4 annual instalments |
| **Special** | **45%** of FCI, cap **₹45 L**, 2 instalments | **45%** of FCI, cap **₹4.5 Cr**, 3 instalments | **35%** of FCI, cap **₹7 Cr**, 4 instalments |

| Rule | Value |
|------|--------|
| Who | **New** manufacturing enterprises only (Scheme Finder: greenfield + mfg + AP) |
| Special category | Wholly owned by women / BC / SC / ST / minority / specially-abled / transgender entrepreneurs with **AP domicile** |
| APIIC land rebate | **75%** rebate on land cost, capped **₹25 L**, for **SC/ST-led micro & small** units in APIIC industrial estates/parks — **once only**, new units |
| Stacking | **Mutually exclusive** with tech-upgradation incentive; combined incentives ≤ **75% of FCI** |
| Do not use for | Pure food-processing capital claim under `AP_FPP`; brownfield tech upgrade (`AP_TECH_UPGRADE`) |

---

## 4. Form questions (AP_EDP’s own 13 steps)

Catalog: `AP_EDP_STEPS` — consecutive **Step 1 … Step 13**.

### Step 1 — Cover & AP eligibility

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Unit / enterprise name | Cover *(synced to legacy wire `clusterName`)* |
| `natureOfBusiness` | Nature of manufacturing | Eligibility |
| `majorProducts` | Major products | Capacity / sales |
| `district` | District (AP) | DIC routing |
| `location` | Proposed unit address | Site |
| `enterpriseSize` | Micro \| Small \| Medium | Cap band |
| `specialCategory` | Yes \| No (women/BC/SC/ST/minority/PwD/transgender, wholly owned, AP domicile) | Rate band |
| `scStOwned` | SC/ST wholly owned? | APIIC land-rebate gate |
| `apDomicile` | Promoter AP domicile confirmed | Hard gate |
| `apiicPark` | Unit inside APIIC industrial park / estate? | Land-rebate hint |
| `entrepreneurName` | Applicant / promoter name | KYC |
| `entrepreneurAge` | Age | Profile |

### Step 2 — Introduction & process

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / industry type | Intro |
| `sectorDescription` | Short intro — what the new unit will do | Narrative |
| `processOfManufacture` | Process of manufacture | Appraisal |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief location / connectivity | Site feasibility |

### Step 4 — Unit profile & capacity

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Proposed activity summary | Glance |
| `yearOfEstablishment` | Proposed commencement / CoD | Implementation |
| `technologyLevel` | Proposed tech level | P&M story |
| `installedCapacity` | Installed capacity | Ops |
| `capacityUtilisationY1` | Capacity utilisation Year 1 (%) | Assumption |

### Step 5 — Market & offtake

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Target customers | Demand |
| `existingDemand` | Demand note | Sales |
| `marketingStrategy` | How products will be sold | Linkages |

### Step 6 — Premises & utilities

| ID | Question | Why |
|----|----------|-----|
| Shed / unit name | Workshed name | Shed card |
| `landDetails` | Land / lease note | FCI support |
| `premisesType` | Owned \| Leased \| Rented | Premises |
| `powerRequirement` | Power (HP / kW) | Utilities / CFE |

### Step 7 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| `applicantName` | Firm / promoter name | Legal |
| `legalStatus` | Sole / partnership / company | Legal |
| Udyam | Ready / applied | Eligibility |

### Step 8 — Project cost (FCI)

| ID | Question | Why |
|----|----------|-----|
| `land` | Land (₹ Lakhs) | FCI |
| `building` | Building / shed (₹ Lakhs) | FCI |
| `machinery` | Plant & machinery (₹ Lakhs) | FCI |
| Utilities / pre-op / WC | As applicable | Full project cost |

**Keep full FCI tables** (unlike MUDRA Shishu) — capital subsidy is on FCI.

### Step 9 — Means of finance (critical)

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own contribution (₹ Lakhs) | Margin |
| `governmentGrant` | AP EDP capital subsidy (₹ Lakhs) | % of FCI by size × special |
| `bankLoan` | Bank term loan (₹ Lakhs) | Credit-linked path |
| `otherSources` | Other (₹ Lakhs) | Rare |

Own + subsidy + bank (+ other) should equal total. Indicative subsidy = min(rate × FCI, size/category cap).

### Step 10 — Operating cost & sales

| ID | Question | Why |
|----|----------|-----|
| Operating / sales fields | Raw material, wages, revenue | P&L |

### Step 11 — Financial viability

| ID | Question | Why |
|----|----------|-----|
| Cash flow / DSCR | If bank loan > 0 | Bank appraisal |

### Step 12 — Implementation schedule

| ID | Question | Why |
|----|----------|-----|
| Milestones | Land → civil → P&M → CoD | Claim timing |

### Step 13 — Documents & uploads

| ID | Upload | Why |
|----|--------|-----|
| `udyamCertificate` | Udyam | Eligibility |
| `landShedAllotment` | Land / shed allotment or lease | Site / APIIC |
| `cfeCfo` | CFE / CFO (Single Desk) | Statutory |
| `caFciStatement` | CA-certified FCI statement | Subsidy base |
| `apDomicileProof` | AP domicile proof | Hard gate |
| `aadhaarPan` | Aadhaar / PAN | KYC |
| `machineryQuotations` | Machinery quotations / invoices | FCI |
| `specialCategoryProof` | If special category | Rate band |
| `scStOwnershipProof` | If SC/ST + APIIC land rebate | Land rebate |

---

## 5. Not in the AP_EDP catalog

- Brownfield / upgrade framing (`AP_TECH_UPGRADE`)  
- Food-processing-only capital path (`AP_FPP`)  
- Multi-unit CFC / SPV  
- Vanilla value-chain / SWOT / national-importance chapters  

---

## 6. Implementation checklist (app)

- [x] `AP_EDP_STEPS` — 13 consecutive UI steps  
- [x] `apEdpQuestions.ts` — extras, 25%/45%/35% helpers, APIIC land-rebate hint  
- [x] Form Step 1 eligibility + FCI MoF note  
- [x] Uploads: Udyam, land/shed, CFE/CFO, CA FCI, domicile  
- [x] Keep land/building FCI tables visible  
- [x] Brief + `create-new-dpr-business-logic.md` row  

Update **this file**, `apEdpQuestions.ts`, and `AP_EDP_STEPS` together when questions change.
