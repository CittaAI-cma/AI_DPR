# ECLGS 5.0 — Detailed Project Report format & form questions

> Scheme code: `ECLGS`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from **Emergency Credit Line Guarantee Scheme 5.0** (NCGTC / DFS) operational guidelines and FAQs (2026).

**Related app files:** `schemeStepCatalog.ts` (`ECLGS_STEPS`), `eclgsQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

ECLGS 5.0 is **additional working-capital liquidity** for **existing** borrowers (MSMEs and non-MSMEs) facing short-term mismatches — **100% NCGTC guarantee for MSMEs**, not a greenfield plant DPR and not PMEGP margin money.

Approved-style packs are:

- **Existing-limit-first** (standard fund-based WC as of the cut-off date)
- **Peak-outstanding-first** (quantum ≈ 20% of peak Q4 WC outstanding, capped)
- **WC-numbers-first** (additional WC sought + repayment for 5-year tenor)
- Free of land / building FCI grids and multi-unit CFC chapters

Create New Latest DPR uses its **own 7 consecutive steps** for `ECLGS`.

---

## 2. Reference guidelines / portals (URLs)

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | Cabinet approval — ECLGS 5.0 | https://www.pmindia.gov.in/en/news_updates/cabinet-approves-emergency-credit-line-guarantee-scheme-5-0/ | Guarantee %, quantum, tenor |
| 2 | NCGTC FAQs (updated) | https://www.ncgtc.in/content/products/0/20260603/FAQs_ECLGS_5_0_updated_as_on_03062026_e58b7de339.pdf | Eligibility, ROI cap, tranche |
| 3 | SBI operational guidelines host | https://sbi.bank.in/documents/71595/0/ECLGS+5.0+Operational+Guidelines+dated+08.05.2026.pdf/aa65cd2a-9c1c-ef9c-9508-b0575efec7e9 | MLI product shape |
| 4 | SBI product page | https://sbi.bank.in/web/business/emergency-credit-line-guarantee-scheme-5 | Bank summary |

**Note:** No public library of filled sample DPRs. Shape = bank WC appraisal note + existing sanction + turnover.

Confirm live cut-off dates / caps with the MLI / NCGTC — scheme windows change.

---

## 3. Product rules (quick reference — MSME path)

| Rule | Value (illustrative ECLGS 5.0) |
|------|--------------------------------|
| Who | Existing borrower with **fund-based WC** in Standard (not SMA-2 / NPA) as of cut-off |
| Quantum | Up to **20%** of peak fund-based WC outstanding in Q4 FY 2025–26, max **₹100 Cr** per borrower |
| Facility | Working Capital Term Loan |
| Guarantee | **100%** for MSMEs (NCGTC); **nil** guarantee fee |
| Interest | Banks: EBLR + 0.75%, **cap 9% p.a.** (floating) |
| Tenor | **5 years** from first disbursement incl. **1-year** moratorium (interest payable in moratorium) |
| Margin | Typically **nil** for MSME path |
| Window | Sanctions until **31 Mar 2027** or guarantee ceiling exhaustion |

---

## 4. Form questions (ECLGS’s own 7 steps)

Catalog: `ECLGS_STEPS` — consecutive **Step 1 … Step 7**.

### Step 1 — Cover & existing facility

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Unit / enterprise name | Cover *(synced to `clusterName`)* |
| `natureOfBusiness` | Nature of business | Profile |
| `majorProducts` | Major products / services | Ops |
| `district` / `location` | Address | KYC |
| `existingLimit` | Existing fund-based WC limit (₹ Lakhs) | Eligibility base |
| `peakWcOutstanding` | Peak Q4 fund-based WC outstanding (₹ Lakhs) | Quantum base |
| `additionalWcSought` | Additional ECLGS WC sought (₹ Lakhs) | ≤ 20% of peak, cap |
| `accountStatus` | Standard \| SMA-1 \| other | Hard gate |
| `entrepreneurName` | Proprietor / authorised signatory | KYC |

### Step 2 — Unit profile

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Present activity | Glance |
| `yearOfEstablishment` | Year established | Existing unit |
| `sectorDescription` | Short ops note | Liquidity need story |

### Step 3 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| Firm / legal status | As usual | KYC |

### Step 4 — WC / project cost

| ID | Question | Why |
|----|----------|-----|
| `workingCapitalMargin` | Additional WC (₹ Lakhs) | Main line |
| Land / building | Hidden | Not FCI |

### Step 5 — Means of finance

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own (usually 0) | Margin nil |
| `governmentGrant` | 0 (guarantee ≠ capital grant) | Clarify |
| `bankLoan` | ECLGS WCTL (₹ Lakhs) | Facility |

### Step 6 — Operating / sales

| ID | Question | Why |
|----|----------|-----|
| Sales / ops | Recent turnover note | Repayment capacity |

### Step 7 — Uploads

Udyam, GST/ITR, bank statements, existing sanction, CA turnover.

---

## 5. Not in the ECLGS catalog

- Greenfield plant / land / building FCI  
- PMEGP margin money  
- Vanilla SWOT / value-chain / impact chapters  

Update **this file**, `eclgsQuestions.ts`, and `ECLGS_STEPS` together when questions change.
