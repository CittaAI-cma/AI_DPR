# PMEGP 2nd Loan (upgrade) — Detailed Project Report format & form questions

> Scheme code: `PMEGP_2ND`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from MoMSME / KVIC **2nd loan / upgradation** guidelines for existing PMEGP / REGP / MUDRA units, using the same bank-unit cost / MoF skeleton as first PMEGP (Excel DPR + common project profiles).

**Related app files:** `schemeStepCatalog.ts` (`PMEGP_2ND_STEPS`), `pmegp2ndQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

PMEGP 2nd loan is a **credit-linked margin-money** product for **brownfield upgrade / expansion** of units that already got PMEGP, REGP, or MUDRA assistance and are performing well. It is **not** a greenfield first PMEGP case.

Approved-style packs are:

- **Prior-assistance-first** (which scheme, sanction amount, year, repayment / MM adjusted)
- **Upgrade-first** (existing vs proposed capacity / machinery — incremental project cost)
- **Numbers-first** (project cost + own **10%** + uniform MM **15%** (20% NER/Hill) + bank)
- Same single-unit tables as first PMEGP (not multi-unit CFC / SPV)

Create New Latest DPR uses its **own 14 consecutive steps** for `PMEGP_2ND`.

---

## 2. Reference DPRs / guidelines (URLs)

PDFs are not stored in-repo (download from these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | MoMSME — PMEGP scheme page (incl. 2nd loan table) | https://www.msme.gov.in/offerings/schemes-and-services/details/prime-minister-employment-generation-programme-and-other-credit-support-schemes-1-MDMzETMtQWa | Official ceilings + 15%/20% upgrade subsidy table; links to 2nd-loan guidelines |
| 2 | PMEGP Guidelines (certified 2022) | https://www.kviconline.gov.in/pmegpeportal/dashboard/notification/PMEGP_Guidelines_Certified_2022_3.pdf | Clause on upgradation: mfg up to ₹1 Cr, service/trading ₹25 L; uniform 15–20% MM; portal module |
| 3 | Guidelines for 2nd loan under PMEGP (12.02.2019) | https://www.kviconline.gov.in/pmegpeportal/dashboard/notification/Guidlines%20for%202nd%20loan%20underPMEGP%20dt12.02.2019.pdf | Bank MM claim process for 2nd dose; mfg/service ceilings; 15%/20% for **all** categories |
| 4 | PMEGP portal — Notifications / FAQ (upgrade eligibility) | https://pmegp.msme.gov.in/Home/FAQ | MM adjusted + first loan repaid; profit / growth; Udyam mandatory |
| 5 | PMEGP e-portal (apply) | https://www.kviconline.gov.in/pmegpeportal/ | Simplified online application for existing units |
| 6 | First PMEGP Excel DPR structure (reuse tables) | Documented in KVIC *PMEGP DPR User Manual*; format extract: https://www.docdroid.net/file/download/JkUkj4P/pmegp-dpr-format-xls.pdf | Same glance / MoF / WC / P&L / BS / cash / repayment sheets — narrate as **upgrade** |
| 7 | KVIC common project profiles (capacity / process reference) | https://www.kviconline.gov.in/pmegp/pmegpweb/docs/jsp/newprojectReports.jsp | Model process + cost tables entrepreneurs adapt for expansion lines |

**Note:** There is **no** separate public library of “2nd-loan-only” model DPRs. Shape = upgrade guidelines + first PMEGP Excel / profile skeleton with brownfield narrative.

---

## 3. Product rules (quick reference)

| Rule | Value |
|------|--------|
| Who | Existing **PMEGP / REGP / MUDRA** units performing well |
| Stage | **Brownfield only** (greenfield → first `PMEGP`) |
| Own contribution | **10%** of project cost (**all** categories) |
| Margin money | **15%** of project cost (**all** categories); **20%** in NER / Hill States |
| Max project (mfg) | **₹1 crore** (max MM ≈ ₹15 L; ₹20 L NER/Hill) |
| Max project (service/trading) | **₹25 lakh** (max MM ≈ ₹3.75 L; ₹5 L NER/Hill) |
| Above ceiling | Bank may finance balance **without** GoI subsidy |
| Eligibility gates | First MM **adjusted**; first loan **repaid** in time; profit / growth potential; **Udyam** mandatory |
| Bank | Same financing bank **or** another willing bank |
| Apply | PMEGP e-portal (upgrade module) → IA scrutiny → bank |

Confirm live ceilings / NER-Hill list with KVIC / DIC before locking numbers.

---

## 4. Form questions (PMEGP_2ND’s own 14 steps)

Catalog: `PMEGP_2ND_STEPS` — consecutive **Step 1 … Step 14**.

### Step 1 — Cover & prior assistance

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Unit / enterprise name | Cover *(synced to legacy wire `clusterName`)* |
| `natureOfBusiness` | Nature of business / upgrade activity | Product line |
| `majorProducts` | Major products / services | Sales |
| `district` | District | IA / bank routing |
| `location` | Unit address | KYC / site |
| `priorScheme` | PMEGP \| REGP \| MUDRA | Hard eligibility |
| `priorSanctionAmount` | First sanction / project cost (₹ L) | History |
| `firstSubsidyYear` | Year of first subsidy / MM | Vintage |
| `marginMoneyAdjusted` | Yes \| No — first MM adjusted? | Eligibility |
| `firstLoanRepaid` | Yes \| No — first loan repaid in time? | Eligibility |
| `yearsProfitable` | Years of continuous profit (expect ≥ 3) | Guidelines |
| `existingTurnover` | Latest annual turnover (₹ L) | Performance |
| `pmegpAgency` | KVIC \| KVIB \| DIC | Implementing agency |
| `nerHill` | Yes \| No — NER / Hill (20% MM)? | Subsidy rate |
| `entrepreneurName` | Applicant full name | Proprietor |
| `entrepreneurAge` | Age (≥ 18) | Eligibility |
| `sectorTypeHint` | Manufacturing \| Service/Trading | Ceiling band |

### Step 2 — Introduction & upgrade process

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / industry type | Intro |
| `sectorDescription` | Short intro — what exists + what upgrade adds | Narrative |
| `processOfManufacture` | Process after upgrade | Technical |
| `existingTech` / upgrade note | Existing technology vs proposed | Upgrade story |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief location / market catchment | Site |

### Step 4 — Unit profile & capacity (existing → proposed)

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Present activity + upgrade summary | Glance |
| `yearOfEstablishment` | Original commencement | History |
| `productionCapacity` / `installedCapacity` | **Proposed** installed capacity after upgrade | Core |
| `existingCapacity` | Existing capacity (before upgrade) | Before/after |
| `capacityUtilisationY1` | Capacity utilisation Year 1 after upgrade (%) | Assumptions |
| `technologyLevel` | Technology / process level post-upgrade | Technical |

### Step 5 — Market & sales assumptions

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Target customers / market | Sales |
| `existingDemand` | Demand / offtake note (why upgrade sells) | Justification |

### Step 6 — Premises & power

| ID | Question | Why |
|----|----------|-----|
| `name` | Premises / workshed | Capex / rent |
| `landDetails` | Premises note (own / lease / rent) | Cost |
| `powerRequirements` | Power (HP / kW) after upgrade | Technical |

### Step 7 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| `spvName` | Firm / proprietor name | Legal |
| `legalStatus` | Sole / partnership / company | Constitution |
| `address` | Correspondence address | KYC |

### Step 8 — Project cost (upgrade / incremental)

| ID | Question | Why |
|----|----------|-----|
| `land` / `building` | Civil / workshed expansion (₹ L) — land cost usually **excluded** | Capex |
| `machinery` | Additional / replacement plant & machinery (₹ L) | Quotes |
| `utilitiesAndInfrastructure` | Other fixed (₹ L) | Capex |
| `preliminaryAndPreOperative` | Preliminary & pre-operative (₹ L) | Capex |
| `workingCapitalMargin` | Working capital (₹ L) | Composite |
| *(derived)* | **Total upgrade project cost** | Must equal MoF |

### Step 9 — Means of finance (critical)

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own contribution (₹ L) — **10%** | Uniform rule |
| `governmentGrant` | PMEGP 2nd-loan margin money (₹ L) — **15%** (20% NER/Hill) | Subsidy |
| `bankLoan` | Bank term loan + / or WC (₹ L) | Balance |
| `otherSources` | Other sources (₹ L) | Rare |

**Rule:** own + MM + bank (+ other) = total project cost. Do **not** use first-PMEGP special-category % tables.

### Step 10 — Operating cost & sales

| ID | Question | Why |
|----|----------|-----|
| Sales / RM / wages / power | Post-upgrade operating assumptions | Feeds P&L |

### Step 11 — Financial viability

| ID | Question | Why |
|----|----------|-----|
| Projected P&L / BS / cash / repayment | Bank + portal | Appraisal |
| DSCR / BEP | Viability | Bank |

### Step 12 — Implementation schedule

| ID | Question | Why |
|----|----------|-----|
| `startDate` / `endDate` / milestones | Upgrade to commercial production | Monitoring |

### Step 13 — Employment & impact

| ID | Question | Why |
|----|----------|-----|
| Direct / indirect employment | Additional jobs from upgrade | Guidelines (~5/unit planning figure) |
| Short impact note | Modernisation / turnover growth | Narrative |

### Step 14 — Documents & uploads

| ID | Document | Why |
|----|----------|-----|
| `priorSanctionLetter` | Prior PMEGP / REGP / MUDRA sanction | Eligibility |
| `caExistingInvestment` | CA certificate of existing investment | Baseline FCI |
| `machineryQuotations` | New machinery quotations | Capex |
| `buildingEstimates` | Building / workshed estimate (if any) | Capex |
| `aadhaarPan` | Aadhaar / PAN | KYC |
| `udyamCertificate` | Udyam | Mandatory |
| `bankPassbook` | Bank passbook / cancelled cheque | Disbursement |
| `profitStatements` | Last 3 years P&L / ITR (if available) | Profit gate |

---

## 5. Not in the PMEGP_2ND catalog

- First-PMEGP rural/urban × general/special subsidy matrix (15/25/35%)  
- Greenfield “new unit” framing  
- Multi-unit CFC / SPV grids  

---

## 6. What must never appear on a PMEGP 2nd DPR

- Claiming this is a **new** first PMEGP unit  
- Using first-loan special-category MM rates instead of uniform **15%** (20% NER/Hill)  
- Own contribution below **10%**  
- Claiming MM above the mfg ₹1 Cr / service ₹25 L project ceilings without noting unsubsidised bank balance  

---

## 7. Maintenance

Update **this file**, `pmegp2ndQuestions.ts`, and `PMEGP_2ND_STEPS` together when questions change.
