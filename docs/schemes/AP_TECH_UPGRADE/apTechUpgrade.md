# AP Technology Upgradation Subsidy — Detailed Project Report format & form questions

> Scheme code: `AP_TECH_UPGRADE`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from **Andhra Pradesh MSME & Entrepreneur Development Policy 4.0 (2024–29)** — Technology Upgradation Cost (para 6.4) and the notified amendment table (APIIC / Industries).

**Related app files:** `schemeStepCatalog.ts` (`AP_TECH_UPGRADE_STEPS`), `apTechUpgradeQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

AP Technology Upgradation is a **state incentive on Fixed Capital Investment (FCI)** for **expansion / diversification / modernisation** of existing enterprises — **not** the new-unit capital subsidy under the same policy (`AP_EDP`).

Approved-style packs are:

- **Brownfield-first** (existing unit + what is being upgraded)
- **Technology-first** (existing vs proposed plant & machinery)
- **FCI-numbers-first** (eligible upgrade FCI + own + bank + **state tech-upgrade subsidy**)
- Mutually exclusive from new-unit EDP capital subsidy on the same FCI
- Free of multi-unit CFC / SPV grids

**Policy:** General central CLCSS is closed. SC/ST seeking **central** P&M capital subsidy use `SCLCSS`. Non-SC/ST (and many AP-domicile units) use **this** state line.

Create New Latest DPR uses its **own 13 consecutive steps** for `AP_TECH_UPGRADE`.

---

## 2. Reference policy / portals (URLs)

PDFs are not stored in-repo (download from these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | AP MSME One — policies hub | https://apmsmeone.ap.gov.in/MSMEONE/Public/Policies.aspx | State policy entry / apply channel |
| 2 | MSME-EDP 4.0 amendment (tech upgrade table) | https://apiic.in/wp-content/themes/custom-theme/assets/Pdfs/MSME2024-29%20Amendment.pdf | Para 6.4 rates, caps, installments; expansion/diversification only |
| 3 | G.O.Ms.No.69 (policy notification context) | https://apiic.in/wp-content/uploads/2024/12/GOMS-NO-69.pdf | Capital subsidy ↔ tech upgrade mutually exclusive; total incentives ≤ 75% FCI |
| 4 | AP MSME-EDP 4.0 policy document (full text mirrors) | Search / Scribd copies of “AP MSME EDP 4.0 2024-29” | Section 6.4 Technology upgradation cost |

**Note:** There is **no** public library of filled sample DPRs for this incentive. Shape = policy FCI tables + bank/DIC appraisal pack (upgrade narrative, quotations, CA FCI).

---

## 3. Product rules (quick reference)

From the **amendment** reading of para 6.4 (confirm live GO / GM-DIC before locking):

| Category | Micro | Small | Medium |
|----------|-------|-------|--------|
| **General** | 20% of FCI, cap **₹20 L**, 2 annual instalments after CoD / 1st invoice | 20% of FCI, cap **₹2 Cr**, 3 annual instalments | 20% of FCI, cap **₹5 Cr**, 4 annual instalments |
| **Special** | 40% of FCI, cap **₹40 L**, 2 instalments | 40% of FCI, cap **₹4 Cr**, 3 instalments | 30% of FCI, cap **₹5 Cr**, 4 instalments |

| Rule | Value |
|------|--------|
| Who | Expansion / diversification / tech upgrade of **existing** units (not greenfield capital subsidy) |
| Special category | Wholly owned by women / BC / SC / ST / minority / specially-abled / transgender entrepreneurs with **AP domicile** |
| Stacking | **Mutually exclusive** with new-unit capital subsidy; combined incentives ≤ **75% of FCI** |
| Scheme Finder in this app | Manufacturing + brownfield/restart + AP domicile + registered |

---

## 4. Form questions (AP_TECH_UPGRADE’s own 13 steps)

Catalog: `AP_TECH_UPGRADE_STEPS` — consecutive **Step 1 … Step 13**.

### Step 1 — Cover & AP eligibility

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Unit / enterprise name | Cover *(synced to legacy wire `clusterName`)* |
| `natureOfBusiness` | Nature of manufacturing / activity | Eligibility |
| `majorProducts` | Major products | Capacity / sales |
| `district` | District (AP) | DIC routing |
| `location` | Unit address | Site |
| `enterpriseSize` | Micro \| Small \| Medium | Cap band |
| `specialCategory` | Yes \| No (women/BC/SC/ST/minority/PwD/transgender, wholly owned, AP domicile) | Rate band |
| `apDomicile` | Promoter AP domicile confirmed | Hard gate |
| `entrepreneurName` | Applicant / promoter name | KYC |
| `entrepreneurAge` | Age | Profile |
| `yearsInOperation` | Years the unit has been in operation | Brownfield proof |
| `existingTurnover` | Latest turnover (₹ L) | Performance |

### Step 2 — Technology upgrade story

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / industry type | Intro |
| `sectorDescription` | Short intro — existing unit + upgrade purpose | Narrative |
| `existingTech` | Existing plant / process / machines | Before |
| `proposedTech` | Proposed new / upgraded P&M (tech specs) | After — claim core |
| `processOfManufacture` | Process after upgrade | Technical |
| `productivityGain` | Expected productivity / quality / cost gain | DIC appraisal |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief location / market catchment | Site |

### Step 4 — Unit profile & capacity

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Present activity + upgrade summary | Glance |
| `yearOfEstablishment` | Original commencement | History |
| `productionCapacity` / `installedCapacity` | Capacity **after** upgrade | Benefit |
| `existingCapacity` | Capacity before upgrade | Before/after |
| `capacityUtilisationY1` | Capacity utilisation Year 1 (%) | Assumptions |
| `technologyLevel` | Technology level post-upgrade | Technical |

### Step 5 — Market & offtake

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Target customers / market | Why upgrade sells |
| `existingDemand` | Demand / offtake note | Justification |

### Step 6 — Premises

| ID | Question | Why |
|----|----------|-----|
| `name` | Premises / workshed | Site |
| `landDetails` / `premisesType` | Own \| lease \| rent / APIIC note | Context |
| `powerRequirements` | Power (HP / kW) | Utilities for new machines |

### Step 7 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| `spvName` | Firm / proprietor name | Legal |
| `legalStatus` | Sole / partnership / company | Constitution |
| `address` | Correspondence address | KYC |

### Step 8 — Project cost (upgrade FCI)

| ID | Question | Why |
|----|----------|-----|
| `land` / `building` | Civil / workshed expansion if any (₹ L) | FCI |
| `machinery` | New / upgraded plant & machinery (₹ L) | Core FCI |
| `utilitiesAndInfrastructure` | Other fixed (₹ L) | FCI |
| `preliminaryAndPreOperative` | Preliminary & pre-operative (₹ L) | FCI |
| `workingCapitalMargin` | WC margin if any (₹ L) | Optional |
| *(derived)* | **Total upgrade project / FCI** | Must equal MoF |

### Step 9 — Means of finance (critical)

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own contribution (₹ L) | Appraisal |
| `governmentGrant` | AP tech-upgrade subsidy (₹ L) — rate × FCI, size cap | State incentive |
| `bankLoan` | Bank term loan (₹ L) | Often credit-linked |
| `otherSources` | Other sources (₹ L) | Rare |

**Rule:** own + subsidy + bank (+ other) = total. Do **not** also claim new-unit EDP capital subsidy on the same FCI. Combined incentives ≤ 75% FCI.

### Step 10 — Operating cost & sales

| ID | Question | Why |
|----|----------|-----|
| Sales / RM / wages / power | Post-upgrade operating assumptions | Feeds P&L |

### Step 11 — Financial viability

| ID | Question | Why |
|----|----------|-----|
| Projected P&L / cash / repayment | Bank / DIC | Viability |
| DSCR / BEP | Appraisal | Bank |

### Step 12 — Implementation schedule

| ID | Question | Why |
|----|----------|-----|
| `startDate` / `endDate` / milestones | Order → install → CoD / first invoice | Installment trigger |

### Step 13 — Documents & uploads

| ID | Document | Why |
|----|----------|-----|
| `udyamCertificate` | Udyam | Formalisation |
| `machineryQuotations` | New machinery quotations / invoices | Capex |
| `oldMachineryList` | List of existing machinery | Before |
| `caFciStatement` | CA statement of upgrade FCI | Claim base |
| `apDomicileProof` | AP domicile proof | Eligibility |
| `aadhaarPan` | Aadhaar / PAN | KYC |
| `termLoanSanction` | Term loan sanction (if any) | Credit path |
| `specialCategoryProof` | Women / SC/ST / BC / PwD ownership proof (if special) | Rate band |

---

## 5. Not in the AP_TECH_UPGRADE catalog

- New-unit EDP capital-subsidy framing (`AP_EDP`)  
- Central SCLCSS / old CLCSS sector lists  
- Multi-unit CFC / SPV grids  

---

## 6. What must never appear on an AP Tech Upgrade DPR

- Claiming this for a **brand-new greenfield** unit (use `AP_EDP` / `AP_CMEP`)  
- Stacking new-unit capital subsidy **and** tech-upgrade on the same FCI  
- Treating the unit as outside Andhra Pradesh / without AP-domicile promoter  

---

## 7. Maintenance

Update **this file**, `apTechUpgradeQuestions.ts`, and `AP_TECH_UPGRADE_STEPS` together when questions change.
