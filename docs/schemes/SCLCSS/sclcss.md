# SCLCSS — Detailed Project Report format & form questions

> Scheme code: `SCLCSS`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from National SC-ST Hub (NSSH) **Special Credit Linked Capital Subsidy Scheme** guidelines / SOP and bank term-loan appraisal practice for plant & machinery.

**Related app files:** `schemeStepCatalog.ts` (`SCLCSS_STEPS`), `sclcssQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

SCLCSS is a **credit-linked capital subsidy** (not margin money like PMEGP) under NSSH for **SC/ST-owned Micro & Small Enterprises** buying **new** plant & machinery / equipment on a bank term loan.

Approved-style packs are:

- **Ownership-first** (SC/ST proprietor, or ≥51% SC/ST partners / promoters)
- **Technology-first** (existing vs proposed plant & machinery — what is being bought)
- **Numbers-first** (eligible P&M cost + term loan + **25%** capital subsidy capped **₹25 lakh**)
- Free of multi-unit CFC / SPV grids and free of old **general CLCSS** sector technology lists (SCLCSS has **no sector-specific tech restrictions**)

**Policy:** General CLCSS closed 31 Mar 2020. Non-SC/ST promoters use `AP_TECH_UPGRADE`, not this code.

Create New Latest DPR uses its **own 13 consecutive steps** for `SCLCSS`.

---

## 2. Reference guidelines / portals (URLs)

PDFs / pages are not stored in-repo (open these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | NSSH — SCLCSS page | https://www.scsthub.in/content/special-credit-linked-capital-subsidy-scheme | Official description, 25% / ₹25 L ceiling, how to apply via PLI |
| 2 | SCLCSS / CLCSS MSME portal | https://sclcss.msme.gov.in/ | Scheme status dashboard + SCLCSS component text |
| 3 | DC-MSME CLCSS portal (legacy + SCLCSS entry) | https://clcss.dcmsme.gov.in/ | Portal entry; points to NSSH SCLCSS |
| 4 | NSSH FAQs (ownership ≥51%) | https://www.scsthub.in/content/frequently-asked-questions | Proprietor / partnership / company SC-ST shareholding rules |
| 5 | Legacy CLCSS application form (field parity for bank file) | https://www.dcmsme.gov.in/publications/forms/frclcss.htm | Illustrative application fields (category, project, loan) — **not** general CLCSS eligibility |

**Note:** There is **no** public library of filled “approved SCLCSS sample DPRs” like KVIC PMEGP profiles. Shape = NSSH rules + **bank term-loan project report** for machinery purchase (cost, MoF, capacity after upgrade, quotations, caste / shareholding proof).

---

## 3. Product rules (quick reference)

| Rule | Value |
|------|--------|
| Subsidy | **25%** capital subsidy on eligible new P&M / equipment via institutional term loan |
| Ceiling | **₹25 lakh** on subsidy (implies ~₹1 crore eligible institutional finance at 25%) |
| Who | SC/ST-owned **Micro / Small** enterprises (mfg **and** service; trading typically out) |
| Ownership | Proprietor SC/ST; partnership / company → SC/ST **≥ 51%** shares |
| Stage | New **or** existing (capacity creation / expansion); Scheme Finder in this app emphasises **tech upgrade / brownfield** |
| Machinery | **New** P&M / equipment only (not second-hand / fabricated) |
| Registration | Valid **Udyam**; enrol MSME data bank where required |
| Apply | Submit claim docs to the **PLI / bank** that sanctioned the term loan → nodal bank / SIDBI / NABARD uploads MIS |

Confirm live SOP on scsthub.in before locking numbers.

---

## 4. Form questions (SCLCSS’s own 13 steps)

Catalog: `SCLCSS_STEPS` — consecutive **Step 1 … Step 13**.

### Step 1 — Cover & SC/ST eligibility

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Unit / enterprise name | Cover *(synced to legacy wire `clusterName`)* |
| `natureOfBusiness` | Nature of business / activity | Mfg or service |
| `majorProducts` | Major products / services | Capacity / sales |
| `district` | District | Bank / NSSH routing |
| `location` | Unit address | KYC / site |
| `sclcssCategory` | SC \| ST | Hard eligibility |
| `controllingStakePercent` | SC/ST controlling stake % (if not sole prop) | Must be ≥ 51 for firms |
| `unitStage` | New \| Existing (expansion / tech upgrade) | NSSH covers both |
| `entrepreneurName` | Applicant / promoter full name | KYC |
| `entrepreneurAge` | Age | Profile |
| `udyamStatus` | Udyam ready / number note | Mandatory |

### Step 2 — Technology upgrade story

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / industry type | Intro |
| `sectorDescription` | Short intro — what the unit does | Narrative |
| `existingTech` | Existing plant / process / tools | Before |
| `proposedTech` | Proposed new P&M / equipment (tech specs) | After — claim core |
| `processOfManufacture` | Process after upgrade (if mfg) | Technical |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief location / market catchment | Site |

### Step 4 — Unit profile & capacity

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Present / proposed activity | Glance |
| `yearOfEstablishment` | Start / commencement | History |
| `productionCapacity` / `installedCapacity` | Capacity **after** new machinery | Benefit of subsidy |
| `capacityUtilisationY1` | Capacity utilisation Year 1 (%) | Assumptions |
| `technologyLevel` | Technology level post-upgrade | Technical |

### Step 5 — Market & offtake

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Target customers / procurement channel | Why upgrade sells (NSSH public procurement angle) |
| `existingDemand` | Demand / offtake note | Sales justification |

### Step 6 — Premises

| ID | Question | Why |
|----|----------|-----|
| `name` | Premises / workshed / workplace | Site |
| `landDetails` / `premisesType` | Own \| lease \| rent | Context |
| `powerRequirements` | Power (HP / kW) if relevant | Utilities for new machines |

### Step 7 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| `spvName` | Firm / proprietor name | Legal |
| `legalStatus` | Sole / partnership / company | Ownership proof type |
| `address` | Correspondence / registered address | KYC |

### Step 8 — Project cost (machinery-led)

| ID | Question | Why |
|----|----------|-----|
| `land` / `building` | Civil / workshed if any (₹ L) — often small vs P&M | Capex |
| `machinery` | **New** plant & machinery / equipment (₹ L) | Subsidy base |
| `utilitiesAndInfrastructure` | Other fixed (₹ L) | Capex |
| `preliminaryAndPreOperative` | Preliminary & pre-operative (₹ L) | Capex |
| `workingCapitalMargin` | Working capital margin (₹ L) if composite | Optional |
| *(derived)* | **Total project cost** | Must equal MoF |

Subsidy is calculated on **eligible P&M** financed by term loan (not on land).

### Step 9 — Means of finance (critical)

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own contribution / equity (₹ L) | Bank appraisal |
| `governmentGrant` | SCLCSS capital subsidy (₹ L) — **25%**, **cap ₹25 L** | Credit-linked claim |
| `bankLoan` | Bank term loan for P&M (₹ L) | PLI finance |
| `otherSources` | Other sources (₹ L) | Rare |

**Rule:** own + SCLCSS + bank (+ other) = total project cost. Indicative subsidy = min(25% of eligible P&M, ₹25 L).

### Step 10 — Operating cost & sales

| ID | Question | Why |
|----|----------|-----|
| Sales / RM / wages / power | Post-upgrade operating assumptions | Feeds P&L |

### Step 11 — Financial viability

| ID | Question | Why |
|----|----------|-----|
| Projected P&L / cash / repayment | Bank appraisal | Term-loan viability |
| DSCR / BEP | Viability | Bank |

### Step 12 — Implementation schedule

| ID | Question | Why |
|----|----------|-----|
| `startDate` / `endDate` / milestones | Order → install → commercial use | Claim timing (often within ~1 year of last disbursement) |

### Step 13 — Documents & uploads

| ID | Document | Why |
|----|----------|-----|
| `casteCertificate` | SC / ST caste certificate(s) | Ownership |
| `ownershipProof` | 51% shareholding proof (if firm) | Eligibility |
| `machineryQuotations` | Machinery quotations / tech specs | Capex |
| `udyamCertificate` | Udyam | Mandatory |
| `caExistingInvestment` | CA certificate of existing FCI (if existing unit) | Baseline |
| `termLoanSanction` | Term loan sanction / in-principle | PLI path |
| `aadhaarPan` | Aadhaar / PAN | KYC |

---

## 5. Not in the SCLCSS catalog

- Old general CLCSS approved-technology sector lists  
- PMEGP-style rural/urban margin-money matrices  
- Multi-unit CFC / SPV shareholding grids  

---

## 6. What must never appear on an SCLCSS DPR

- General-category promoter claiming SCLCSS (use `AP_TECH_UPGRADE`)  
- Second-hand / fabricated machinery as eligible P&M  
- Claiming subsidy above **₹25 lakh**  
- Trading-only activity without MSE manufacturing/service processing  

---

## 7. Maintenance

Update **this file**, `sclcssQuestions.ts`, and `SCLCSS_STEPS` together when questions change.
