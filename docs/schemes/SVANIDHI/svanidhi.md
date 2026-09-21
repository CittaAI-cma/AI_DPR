# PM SVANidhi — Detailed Project Report format & form questions

> Scheme code: `SVANIDHI`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from **PM SVANidhi Scheme Guidelines** (MoHUA / DFS, restructured Sep 2025) and Loan Operational Guidelines (CGTMSE annexures).

**Related app files:** `schemeStepCatalog.ts` (`SVANIDHI_STEPS`), `svanidhiQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

PM SVANidhi is a **Central Sector** micro-credit scheme for **street vendors** — **collateral-free working-capital term loans** in three tranches, **7% interest subsidy**, digital cashback, and (for eligible 3rd-tranche vendors) a UPI-linked RuPay credit card. It is **not** PMEGP margin money and **not** a general MUDRA / term-loan factory DPR.

Approved-style packs are:

- **Vending-proof-first** (CoV / vendor ID **or** portal digital LoR)
- **UPI-first** (unique UPI ID linked to the vendor’s bank account — mandatory)
- **Tranche-first** (₹15k → ₹25k → ₹50k WC; next tranche only after full repayment of previous)
- Free of multi-unit CFC / SPV / heavy FCI grids
- Very light numbers (daily sales + stock / WC need + EMI capacity)

Create New Latest DPR uses its **own 10 consecutive steps** for `SVANIDHI`.

---

## 2. Reference guidelines / portals (URLs)

PDFs are not stored in-repo (download from these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | Official portal | https://pmsvanidhi.mohua.gov.in | Apply, LoR, lender routing |
| 2 | Scheme guidelines (Sep 2025, NMC host) | https://nmcnagpur.gov.in/assets/300/2025/09/Public-Notices/Scheme_Guidelines_-_6925_(1)_250916_155553.pdf | Eligibility, tranches, digital, coverage |
| 3 | Scheme guidelines Annexure-I (CGTMSE) | https://www.cgtmse.in/Default/ViewFile/?id=1767027747558_PM+SVANidhi+Scheme+Guidelines+-+16.9.25%28Annexure+-I%29.pdf&path=Circular | Same restructured text |
| 4 | Loan operational guidelines Annexure-II | https://www.cgtmse.in/Default/ViewFile/?id=1767027845598_Loan+Operational+Guidelines+-+16.09.2025%28Annexure+-II%29.pdf&path=Circular | Tranche ops, CoV/LoR, UPI mandatory |
| 5 | Cabinet note — restructuring & extension | https://www.pmindia.gov.in/en/news_updates/cabinet-approves-restructuring-extension-of-lending-period-beyond-31-12-2024-of-pm-street-vendors-atmanirbhar-nidhi-pm-svanidhi-scheme/ | ₹15k / ₹25k / ₹50k; lending to Mar 2030 |

**Note:** There is **no** public library of filled sample DPRs for PM SVANidhi. Shape = portal application + short WC business note (goods, pitch, daily sales, repayment).

---

## 3. Product rules (quick reference)

| Rule | Value |
|------|--------|
| Who | Street vendor (Street Vendors Act definition) in statutory town / census town / peri-urban (graded) |
| Age | Typically ≥ **18** |
| Proof | **CoV / ID** from ULB/TVC **or** **digital LoR** on PMS portal (manual LoR not valid). CoV/ID holders do **not** need LoR |
| Peri-urban / census | LoR via Block Development Office after verification |
| UPI | Unique UPI ID linked to vendor bank account — **mandatory** |
| Tranche 1 | Up to **₹15,000**, tenor **12 months** (min loan often ₹5,000 — confirm LI) |
| Tranche 2 | Up to **₹25,000**, tenor **18 months** — only after **full repayment** of Tranche 1 |
| Tranche 3 | Up to **₹50,000**, tenor **36 months** — only after full repayment of Tranche 2 |
| Interest | Lender’s applicable rate; **7% p.a. interest subsidy** credited quarterly if account Standard |
| Credit card | UPI-linked RuPay card for eligible 3rd-tranche path (limit builds toward ₹30,000) |
| Digital cashback | Retail/wholesale incentives (up to ~₹1,600/year — confirm live) |
| Lending window | Extended to **31 Mar 2030** (confirm live GO) |

Confirm live caps / min amounts on pmsvanidhi.mohua.gov.in before locking numbers.

---

## 4. Form questions (SVANIDHI’s own 10 steps)

Catalog: `SVANIDHI_STEPS` — consecutive **Step 1 … Step 10**.

### Step 1 — Cover & vending eligibility

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Vendor / stall / cart name | Cover *(synced to legacy wire `clusterName`)* |
| `natureOfBusiness` | Nature of vending | Narrative |
| `majorProducts` | Goods / services sold | Sales & WC |
| `district` | District / ULB | Portal / LI routing |
| `location` | Pitch / vending address | KYC / site |
| `covOrLor` | CoV \| LoR (portal digital) | Hard eligibility |
| `upiQr` | UPI ID linked to bank account | Mandatory |
| `entrepreneurName` | Vendor full name | KYC |
| `entrepreneurAge` | Age (≥ 18) | Eligibility |
| `yearsVending` | Years in street vending | Profile |
| `loanTranche` | First \| Second \| Third | MoF band |
| `vendingType` | Footpath / cart / stall / market / moving / other | Pitch type |

### Step 2 — Vending activity

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / trade type | Intro |
| `sectorDescription` | Short intro — what you sell / offer | Narrative |
| `processOfManufacture` | How you source, prepare, and sell | Ops note (food / goods) |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief pitch location / footfall catchment | Site feasibility |

### Step 4 — Vendor profile

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Present vending summary | Glance |
| `yearOfEstablishment` | When vending started | Profile |
| `productionCapacity` | Throughput if useful (plates / day, customers / day) | Ops |
| `dailySales` | Approx daily sales (₹) | WC & repayment |

### Step 5 — Market & sales assumptions

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Typical customers | Demand |
| `existingDemand` | Peak / lean footfall note | Sales |
| `marketingStrategy` | How customers find you | Linkages |

### Step 6 — Pitch / workplace

| ID | Question | Why |
|----|----------|-----|
| Shed / pitch name | Stall / cart name | Light |
| `landDetails` | Pitch note (ULB allotted / temporary) | Light |
| `workplaceType` | Same as vending type if needed | Premises |
| Power | Optional (cart lighting, etc.) | Rare |

### Step 7 — Applicant

| ID | Question | Why |
|----|----------|-----|
| `applicantName` | Proprietor name | Usually same as vendor |
| `legalStatus` | Typically sole / individual | Legal |

### Step 8 — Working-capital / project cost

| ID | Question | Why |
|----|----------|-----|
| `machinery` | Cart / utensils / small equipment (₹ Lakhs) | Light fixed |
| `workingCapitalMargin` | Stock / WC (₹ Lakhs) | Main use of loan |
| Land / building | **0** (hidden) | Lean |

### Step 9 — Means of finance (critical)

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own funds (₹ Lakhs) | Margin (often small) |
| `governmentGrant` | Usually **0** (interest subsidy is not capital grant) | Clarify |
| `bankLoan` | WC term loan tranche (₹ Lakhs) | 0.15 / 0.25 / 0.50 |
| `otherSources` | Other (₹ Lakhs) | Rare |

Own + bank (+ other) should equal total. **7% interest subsidy** is quarterly cashback on interest — not a capital MoF line.

### Step 10 — Documents & uploads

| ID | Upload | Why |
|----|--------|-----|
| `covOrLor` | CoV / vendor ID **or** portal LoR | Eligibility |
| `aadhaarPan` | Aadhaar | KYC |
| `bankPassbook` | Savings passbook / statement | Disbursement |
| `upiProof` | UPI ID / QR screenshot (optional) | Digital mandate |

---

## 5. Not in the SVANIDHI catalog

- Multi-unit CFC / SPV  
- PMEGP margin-money / agency tables  
- Heavy land / building / DSCR-heavy industrial P&L  
- Vanilla value-chain / SWOT / national-importance chapters  

---

## 6. Implementation checklist (app)

- [x] `SVANIDHI_STEPS` — 10 consecutive UI steps  
- [x] `svanidhiQuestions.ts` — extras, tranche helpers  
- [x] Form Step 1 eligibility + lean MoF note  
- [x] Uploads: CoV/LoR, Aadhaar, passbook (+ UPI proof)  
- [x] `hideComplexCapex` always on for this scheme  
- [x] Brief + `create-new-dpr-business-logic.md` row  

Update **this file**, `svanidhiQuestions.ts`, and `SVANIDHI_STEPS` together when questions change.
