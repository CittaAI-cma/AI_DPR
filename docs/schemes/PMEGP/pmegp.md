# PMEGP — Detailed Project Report format & form questions

> Scheme code: `PMEGP`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from KVIC model project profiles and the official PMEGP Excel DPR template (not named individual sanction letters).

**Related app files:** `schemeStepCatalog.ts` (`PMEGP_STEPS`), `pmegpQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

Banks, DICs, KVIB and KVIC appraise PMEGP as a **single-unit, credit-linked subsidy** case. Approved-style DPRs are:

- Short and **numbers-first**
- Built around **project cost + means of finance (incl. margin money) + projections**
- Free of **cluster / CFC / SPV** chapters

Our Create Latest DPR used a cluster skeleton. For `PMEGP` we replace that with the bank unit skeleton below.

---

## 2. Reference DPRs (URLs)

PDFs are not stored in-repo (download from these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | Official PMEGP DPR Excel structure (Application / Data sheet / Project report / Front) | Documented in KVIC *PMEGP DPR User Manual*; format extract: https://www.docdroid.net/file/download/JkUkj4P/pmegp-dpr-format-xls.pdf | Canonical sheet layout: glance, MoF, WC, P&L, BS, cash, repayment |
| 2 | Bakery Products (KVIC common project profile) | https://kviconline.gov.in/pmegp/pmegpweb/docs/commonprojectprofile/BAKERY%20PRODUCTS.pdf | Process + capex + WC + total cost (~₹13 L) |
| 3 | Bakery Products Big Unit | https://kviconline.gov.in/pmegp/pmegpweb/docs/commonprojectprofile/BAKERY%20PRODUCTS%20BIG%20UNIT.pdf | Same skeleton at larger cost (~₹19.7 L) |
| 4 | Curd Manufacturing Unit | https://kviconline.gov.in/pmegp/pmegpweb/docs/commonprojectprofile/Curdunit.pdf | Process steps + assumptions + capacity |
| 5 | Aluminium Fabrication | https://kviconline.gov.in/pmegp/pmegpweb/docs/commonprojectprofile/AluminiumFabrictaion.pdf | Machinery list + raw material + cost analysis |

**Index of all KVIC PMEGP profiles:** https://www.kviconline.gov.in/pmegp/pmegpweb/docs/jsp/newprojectReports.jsp

---

## 3. Form questions (PMEGP’s own 14 steps)

PMEGP does **not** use the vanilla 18-step list. It has its own catalog in `schemeStepCatalog.ts` (`PMEGP_STEPS`): consecutive **Step 1 … Step 14**.

Each row is a question the entrepreneur must answer when scheme = `PMEGP`.

### Step 1 — Cover & entrepreneur

| ID | Question | Why |
|----|----------|-----|
| `clusterName` | Unit / project name | Appears on cover and glance sheet |
| `natureOfBusiness` | Nature of business / activity | Product line banks appraise |
| `majorProducts` | Major products / services | Sales & capacity tables |
| `district` | District | Agency routing + rural/urban |
| `location` | Village / town / park | Location proof |
| `pmegpCategory` | Category: general \| special (SC/ST/OBC/Minority/Women/Ex-serviceman/PwD) | Sets subsidy % and own-contribution % |
| `pmegpArea` | Area: rural \| urban | Sets subsidy % (15/25 vs 25/35) |
| `pmegpAgency` | Implementing agency: KVIC \| KVIB \| DIC | Portal + forwarding path |
| `entrepreneurName` | Entrepreneur full name | Glance / declaration |
| `entrepreneurAge` | Age (must be ≥ 18) | Hard eligibility |
| `educationStatus` | Below 8th / 8th pass or higher | Education gate if cost high |

### Step 2 — Introduction & process

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / industry type | Intro heading |
| `sectorDescription` | Short intro — why this unit | Local demand narrative |
| `processOfManufacture` | Process of manufacture (step-by-step) | Present in every KVIC sample |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief location / connectivity note | Site feasibility |

### Step 4 — Unit profile & capacity

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Proposed activity summary | Glance sheet |
| `yearOfEstablishment` | Proposed start year / month | Implementation |
| `technologyLevel` | Technology / process level | Bank technical note |
| `installedCapacity` | Installed capacity (unit/day or month) | Utilisation tables |
| `capacityUtilisationY1` | Capacity utilisation Year 1 (%) | Sample DPRs ramp from ~60% |

### Step 5 — Market & sales assumptions

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Target customers / market | Sales realisation |
| `existingDemand` | Demand note | Justification of sales |

### Step 6 — Workshed / premises & power

| ID | Question | Why |
|----|----------|-----|
| `name` / shed fields | Workshed / premises details | Capex — building / rent |
| `landDetails` | Own / lease / rent | Cost vs rent in P&L |
| `powerRequirement` | Power (HP / kW) | Technical + power cost |

### Step 7 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| `spvName` / applicant | Firm / proprietor name | Legal entity |
| `legalStatus` | Sole / partnership / company | PMEGP requires registered firm |
| `address` | Correspondence address | KYC |

### Step 8 — Project cost

| ID | Question | Why |
|----|----------|-----|
| `building` | Land / building / workshed (₹ L) — land + building fields | Capex head |
| `machinery` | Plant & machinery (₹ L) | Capex head — need quotations |
| `utilitiesAndInfrastructure` | Furniture & fixtures (₹ L) | Capex head (UI label for PMEGP) |
| `preliminaryAndPreOperative` | Preliminary & pre-operative (₹ L) | Capex head |
| `workingCapitalMargin` | Working capital (₹ L) | Always in PMEGP total cost |
| *(derived)* | **Total project cost** | Must equal means of finance |

### Step 9 — Means of finance (critical)

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own contribution (₹ L) | Typically 10% general / 5% special |
| `governmentGrant` | **PMEGP margin money / subsidy (₹ L)** | 15/25/25/35% by urban–rural × category; parked as TDR ~3 years |
| `bankLoan` | Bank term loan + WC (₹ L) | Balance of project cost |
| `otherSources` | Other sources (₹ L) | Rare; must still balance |
| `pmegpSubsidyPercent` | Applied subsidy % (display / check) | Must match category × area |
| `pmegpOwnPercent` | Applied own % (display / check) | Consistency check |

**Rule:** own + subsidy + bank (+ other) = total project cost.

### Step 10 — Operating cost & sales

| ID | Question | Why |
|----|----------|-----|
| Sales / RM / wages / power schedules | Annual operating assumptions | Feeds P&L |
| Working-capital cycle notes | Stock / debtor / creditor days | WC estimate basis |

### Step 11 — Financial viability

| ID | Question | Why |
|----|----------|-----|
| Projected P&L (5 years) | Bank appraisal core | Every sample has it |
| Balance sheet / cash flow / repayment | Bank appraisal core | Excel DPR sheets |
| BEP / DSCR | Viability | Present in template |

### Step 12 — Implementation schedule

| ID | Question | Why |
|----|----------|-----|
| `startDate` / `endDate` / milestones | Implementation period | Glance + monitoring |

### Step 13 — Employment & impact

| ID | Question | Why |
|----|----------|-----|
| Direct / indirect employment | PMEGP objective | Employment generation |
| Short impact note | Optional | Keep light vs cluster impact essays |

### Step 14 — Documents & uploads

| ID | Document | Why |
|----|----------|-----|
| `aadhaarPan` | Aadhaar / PAN | KYC |
| `machineryQuotations` | Machinery quotations | Capex proof |
| `buildingEstimates` | Building / shed estimate | Capex proof |
| `casteCertificate` | If special category | Higher subsidy |
| `educationCertificate` | If education gate applies | 8th pass rule |
| `udyamCertificate` | Udyam (or willingness) | Registration path |
| `bankPassbook` | Bank account | Disbursement |

---

## 4. Not in the PMEGP catalog

These topics belong to CFC / cluster DPRs and are **omitted** from PMEGP’s 14 steps (not “hidden gaps” in an 18-step list):

- Value chain mapping  
- Cluster need-gap analysis  
- Formal SWOT chapters  
- Proposed CFC / SPV activity plans  

---

## 5. Subsidy logic (quick reference)

| Category | Urban | Rural |
|----------|-------|-------|
| General | 15% | 25% |
| Special (SC/ST/OBC/Minority/Women/Ex-serviceman/PwD, etc.) | 25% | 35% |

Own contribution (typical KVIC): **10% general / 5% special**. Confirm live GO before locking numbers.

Education gate (app): manufacturing-like cost &gt; ₹10 L or service-like &gt; ₹5 L → require 8th pass upload.

---

## 6. What must never appear on a PMEGP DPR

- Common Facility Centre (CFC)  
- SPV / member-unit grids  
- Multi-enterprise cluster employment tables as the main story  

---

## 7. Maintenance

Any change to PMEGP Create New Latest DPR questions must update **this file**, `client/src/lib/individualDpr/pmegpQuestions.ts`, and `PMEGP_STEPS` in `schemeStepCatalog.ts` together.
