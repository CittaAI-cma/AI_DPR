# Stand-Up India — Detailed Project Report format & form questions

> Scheme code: `STANDUP`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from Stand-Up Mitra / DFS guidelines and Scheduled Commercial Bank application checklists (PNB / UCO / SBI).

**Related app files:** `schemeStepCatalog.ts` (`STANDUP_STEPS`), `standupQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

Stand-Up India is a **composite bank loan** (term + working capital), **not a capital-subsidy scheme**. DFS / banks appraise a **greenfield unit project report** for SC / ST / women entrepreneurs.

Approved-style packs are:

- **Eligibility-first** (woman / SC / ST; ≥51% controlling stake for non-individuals)
- **Numbers-first** (project cost + own margin ≥10% + bank composite loan + capacity / sales / P&L for loan tenor)
- Free of multi-unit CFC / SPV grids
- Heavier than MUDRA (₹10 L–₹1 Cr) — banks often require a full project report for term funding, especially above ~₹25 L

Create New Latest DPR uses its **own 13 consecutive steps** for `STANDUP`.

---

## 2. Reference DPRs / forms (URLs)

PDFs are not stored in-repo (download from these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | Stand-Up Mitra portal (apply / handholding) | https://www.standupmitra.in/ | Official SIDBI portal |
| 2 | Scheme guidelines (portal) | https://www.standupmitra.in/Home/SchemeGuidelines | Eligibility, composite loan, greenfield |
| 3 | DFS — Stand-Up India scheme page | https://financialservices.gov.in/stand-india-scheme-supi | Ministry summary + JanSamarth link |
| 4 | PIB factsheet — Stand-Up India | https://static.pib.gov.in/WriteReadData/specificdocs/documents/2022/apr/doc20224535601.pdf | Channels: branch / portal / LDM |
| 5 | SIDBI brochure (guidelines extract) | https://static.investindia.gov.in/s3fs-public/2019-07/Stand%20Up%20India%20-%20Brochure%20-%20English.pdf | SUCC handholding; DPR support via SIDBI/NABARD/DIC |
| 6 | UCO Bank — Stand-Up India application + checklist | https://www.uco.bank.in/documents/d/guest/standup-india-application-form-1 | Checklist item 13–14: project report (machinery, capacity, P&L/BS for tenor, process, buyers, competitors) |
| 7 | SBI — Stand-Up India product page | https://sbi.co.in/web/business/sme/sme-government-schemes/sui | Margin ≥10% (up to 15%), tenor up to 7 yrs, moratorium ≤18 months, CGSSI |

**Also apply via:** https://www.jansamarth.in/ (as linked by DFS).

---

## 3. Product rules (quick reference)

| Rule | Value |
|------|--------|
| Loan band | Above ₹10 lakh to ₹1 crore (composite TL + WC) |
| Who | Woman **or** SC **or** ST (age ≥ 18) |
| Firm stake | For non-individuals: ≥ **51%** shareholding & control by eligible person |
| Stage | **Greenfield only** (first venture in that activity) |
| Own margin | Minimum **10%** of project cost (scheme margin typically up to 15%; may converge with other subsidies) |
| Tenor | Up to ~7 years; moratorium up to ~18 months (lender-specific) |
| Guarantee | Credit Guarantee Fund Scheme for Stand-Up India Loans (CGSSI / CGFSI) — not a cash subsidy |

Confirm live product status with the bank / standupmitra.in (scheme window / successor product messaging may change).

---

## 4. Form questions (STANDUP’s own 13 steps)

Catalog: `STANDUP_STEPS` — consecutive **Step 1 … Step 13**.

### Step 1 — Cover & eligibility

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Unit / enterprise name | Cover + application *(synced to legacy wire `clusterName`)* |
| `natureOfBusiness` | Nature of business / activity | Greenfield activity |
| `majorProducts` | Major products / services | Sales & capacity |
| `district` | District | Branch / LDM routing |
| `location` | Unit address | KYC / site |
| `standupCategory` | Woman \| SC \| ST | Hard eligibility |
| `entrepreneurName` | Applicant full name | Proprietor / promoter |
| `entrepreneurAge` | Age (≥ 18) | Eligibility |
| `controllingStakePercent` | Controlling stake % (if not sole prop) | Must be ≥ 51 for firms |
| `loanAmountSought` | Composite loan sought (₹ L) | Band check vs ₹10 L–₹1 Cr |

### Step 2 — Business activity & process

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / industry type | Intro |
| `sectorDescription` | Short intro — what the unit will do | Narrative |
| `processOfManufacture` | Process of manufacture / service delivery | Bank checklist (esp. mfg) |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief location / connectivity | Site feasibility |

### Step 4 — Unit profile & capacity

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Proposed activity summary | Glance |
| `yearOfEstablishment` | Proposed commencement | Implementation |
| `productionCapacity` / `installedCapacity` | Installed capacity | Bank checklist |
| `capacityUtilisationY1` | Capacity utilisation Year 1 (%) | Assumption basis |
| `technologyLevel` | Technology / process level | Technical note |

### Step 5 — Market, buyers & competition

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Target customers / buyers | Checklist |
| `existingDemand` | Demand note | Sales justification |
| `competitorAnalysis` | Major competitors + your strengths / weaknesses | Explicit in bank checklist >₹25 L |

### Step 6 — Premises

| ID | Question | Why |
|----|----------|-----|
| `name` | Premises / shed / workplace | Capex / rent |
| `landDetails` / `premisesType` | Own \| lease \| rent | Cost vs rent |
| `powerRequirements` | Power (HP / kW) | Technical |

### Step 7 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| `spvName` | Firm / proprietor name | Legal entity |
| `legalStatus` | Sole / partnership / company | Constitution |
| `address` | Correspondence / registered address | KYC |

### Step 8 — Project cost

| ID | Question | Why |
|----|----------|-----|
| `land` / `building` | Land / building / workshed (₹ L) | Capex |
| `machinery` | Plant & machinery (₹ L) | Quotes required |
| `utilitiesAndInfrastructure` | Furniture / fixtures / other fixed (₹ L) | Capex |
| `preliminaryAndPreOperative` | Preliminary & pre-operative (₹ L) | Capex |
| `workingCapitalMargin` | Working capital (₹ L) | Composite loan WC leg |
| *(derived)* | **Total project cost** | Must equal MoF |

### Step 9 — Means of finance

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own contribution (₹ L) — **≥ 10% of project cost** | Scheme margin rule |
| `bankLoan` | Bank composite loan TL + WC (₹ L) | Stand-Up India facility |
| `governmentGrant` | Other subsidy / grant if converging (₹ L) — else 0 | Convergence allowed; not the main product |
| `otherSources` | Other sources (₹ L) | Rare |

**Rule:** own + bank (+ grant/other) = total project cost. Own ≥ 10% of total.

### Step 10 — Operating cost & sales

| ID | Question | Why |
|----|----------|-----|
| Sales / RM / wages / power | Operating assumptions | Feeds P&L |
| WC cycle notes | Stock / debtor / creditor days | WC sizing |

### Step 11 — Financial viability

| ID | Question | Why |
|----|----------|-----|
| Projected P&L / BS / cash / repayment | For loan tenor | Bank checklist |
| DSCR / BEP | Viability | Bank appraisal |

### Step 12 — Implementation schedule

| ID | Question | Why |
|----|----------|-----|
| `startDate` / `endDate` / milestones | Setup to commercial production | Moratorium / monitoring |

### Step 13 — Documents & uploads

| ID | Document | Why |
|----|----------|-----|
| `aadhaarPan` | Aadhaar / PAN | KYC |
| `casteCertificate` | If SC / ST | Category proof |
| `ownershipProof` | 51% stake proof (if firm) | Eligibility |
| `machineryQuotations` | Machinery quotations | Capex |
| `buildingEstimates` / premises | Building / lease | Capex |
| `udyamCertificate` | Udyam | Registration |
| `bankPassbook` | Bank account | Disbursement |

---

## 5. Not in the STANDUP catalog

- Multi-unit CFC / SPV shareholding grids  
- PMEGP-style rural/urban margin-money % tables  
- Formal SWOT / value-chain / gap chapters as separate steps (competitors folded into Step 5)

---

## 6. What must never appear on a Stand-Up India DPR

- Claiming this is a KVIC / PMEGP margin-money case  
- Brownfield expansion of an existing unit in the same activity as “greenfield”  
- Borrower who is neither woman nor SC/ST (unless 51%+ control is with eligible person)

---

## 7. Maintenance

Update **this file**, `standupQuestions.ts`, and `STANDUP_STEPS` together when questions change.
