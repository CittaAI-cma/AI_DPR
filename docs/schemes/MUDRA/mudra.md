# MUDRA (PMMY) — Detailed Project Report format & form questions

> Scheme code: `MUDRA`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from the PMMY common loan application (Shishu / Kishore / Tarun), bank checklists, and bank-accepted micro-unit project-report structure.

**Related app files:** `schemeStepCatalog.ts` (`MUDRA_STEPS`), `mudraQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

MUDRA (PMMY) is **not a subsidy scheme**. MUDRA refinances banks / NBFCs / MFIs that lend to non-corporate micro units. The lender appraises a **short unit project report** plus the **common PMMY application**.

Approved-style packs are:

- **Category-first** (Shishu / Kishore / Tarun / Tarun Plus)
- **Numbers-first** (project cost + own funds + bank loan + sales / WC)
- Free of multi-unit CFC / SPV / subsidy-margin-money chapters
- Lighter than PMEGP — no KVIC margin money, no agency (KVIC/KVIB/DIC) routing

Create New Latest DPR uses its **own 12 consecutive steps** for `MUDRA` (not a shared 18-step list).

---

## 2. Reference DPRs / forms (URLs)

PDFs are not stored in-repo (download from these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | Official MUDRA portal (categories, bankers kit, Udyami profiles) | https://www.mudra.org.in/ | Canonical product bands + bankers kit entry |
| 2 | PMMY Bankers Kit (Shishu / Kishore–Tarun forms) | https://www.mudra.org.in/Home/PMMYBankersKit | Official form pack index |
| 3 | PNB — Common PMMY loan application (Shishu/Kishore/Tarun) | https://www.pnb.bank.in/document/SMEBanking/HO_MSME_Bilingual_Common_Loan_Application_form_PMMY.pdf | Enterprise + proprietor + activity + checklist (project report required) |
| 4 | Canara Bank — PMMY application + checklist | https://www.canarabank.bank.in/documents/d/guest/NF%201010_b-1 | Same common form; checklist: KYC, shop proof, BS ≥₹2L, project report |
| 5 | Bank of Maharashtra — PMMY common application | https://bankofmaharashtra.in/writereaddata/documentlibrary/83b516a7-6627-40c8-8ace-76a229d9a499.pdf | Another public-sector common form (field parity) |
| 6 | Shishu application (upto ₹50,000) — sample hosted copy | https://cscportal.in/wp-content/uploads/2020/05/Application_Form_for_Shishu.pdf | One-page Shishu shape (very light vs Kishore/Tarun) |
| 7 | Illustrative bank-style MUDRA project report (Kirana / Kishore) | https://mudraready.in/sample-report | Third-party sample of tables banks accept: cost, MoF, 5-yr P&L, cash, repayment, DSCR |

**Apply online (lender path):** https://udyamimitra.in/ (Udyamimitra) or any PMMY member bank / NBFC / MFI.

---

## 3. Product bands (quick reference)

| Category | Indicative loan band | DPR weight in this app |
|----------|----------------------|-------------------------|
| Shishu | up to ₹50,000 | Light — hide land/building capex tables; Nayak WC hint on viability |
| Kishore | > ₹50,000 to ₹5 lakh | Same light capex rule when VM budget is under ₹5L |
| Tarun | > ₹5 lakh to ₹10 lakh | Full unit cost + P&L |
| Tarun Plus | > ₹10 lakh to ₹20 lakh | Full pack + prior Mudra closure upload |

Scheme Finder treats MUDRA project-cost cap as **₹20 lakh**. Confirm live lender product names before locking numbers.

---

## 4. Form questions (MUDRA’s own 12 steps)

Catalog: `MUDRA_STEPS` in `schemeStepCatalog.ts` — consecutive **Step 1 … Step 12**.

### Step 1 — Cover & category

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Unit / enterprise name | Application + cover *(also synced to legacy wire key `clusterName` for save/generate)* |
| `natureOfBusiness` | Nature of business / activity | Existing vs proposed activity |
| `majorProducts` | Major products / services | Sales tables |
| `district` | District | Branch routing |
| `location` | Shop / unit address (village / town) | KYC / shop proof |
| `mudraCategory` | Shishu \| Kishore \| Tarun \| Tarun Plus | Product band + form depth |
| `entrepreneurName` | Proprietor / applicant full name | Application section C |
| `entrepreneurAge` | Age (must be ≥ 18) | Eligibility |
| `experienceYears` | Experience in this line (years) | Application background |

### Step 2 — Business activity

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / industry type | Intro heading |
| `sectorDescription` | Short intro — what the unit does / will do | Technical note (keep short) |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief location / market catchment | Site feasibility (one note) |

### Step 4 — Unit profile

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Present / proposed activity summary | Glance |
| `yearOfEstablishment` | Start / commencement (existing or proposed) | Application “date of commencement” |
| `productionCapacity` | Capacity / throughput (if applicable) | Operations note |
| `technologyLevel` | Tools / process level | Light technical note |

### Step 5 — Market & sales assumptions

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Target customers | Sales realisation |
| `existingDemand` | Demand / footfall note | Justification of sales |

### Step 6 — Premises

| ID | Question | Why |
|----|----------|-----|
| `name` | Shop / shed / workplace name | Premises identity |
| `landDetails` / `premisesType` | Owned \| rented (+ brief lease note) | Application “business premises” |
| `powerRequirements` | Power (if manufacturing) | Optional technical |

### Step 7 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| `spvName` | Firm / proprietor name | Legal entity |
| `legalStatus` | Sole / partnership / company | Constitution on application |
| `address` | Correspondence / registered address | KYC |

### Step 8 — Project cost

| ID | Question | Why |
|----|----------|-----|
| `land` / `building` | Land / building (₹ L) | **Hidden for Shishu / Kishore** (VM budget under ₹5L) |
| `machinery` | Plant / machinery / equipment (₹ L) | Capex / quotes |
| `utilitiesAndInfrastructure` | Furniture / fixtures / other fixed (₹ L) | Capex |
| `preliminaryAndPreOperative` | Preliminary & pre-operative (₹ L) | Capex |
| `workingCapitalMargin` | Working capital (₹ L) | Core for trade / service Mudra |
| *(derived)* | **Total project cost** | Must equal means of finance |

### Step 9 — Means of finance

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own contribution (₹ L) | Promoter margin |
| `bankLoan` | Bank term loan + / or WC (₹ L) | PMMY loan |
| `otherSources` | Other sources (₹ L) | Rare |
| `governmentGrant` | Usually **0** (MUDRA is not a subsidy) | Keep field but label clearly |

**Rule:** own + bank (+ other) ≈ total project cost. No PMEGP-style margin money %.

### Step 10 — Operating cost & sales

| ID | Question | Why |
|----|----------|-----|
| Sales / RM / wages / power schedules | Annual operating assumptions | Feeds P&L |
| WC cycle notes | Stock / debtor / creditor days | WC estimate (esp. Kishore+) |

### Step 11 — Financial viability

| ID | Question | Why |
|----|----------|-----|
| Projected P&L | Bank appraisal (≥₹2L checklist often wants projections) | Common form checklist item 8 |
| Cash flow / repayment / DSCR | When term loan > 0 | Bank pack |
| Nayak WC hint | Shishu / Kishore: WC ≈ 20% of turnover, margin ≈ 5% of that | App helper (not a GO formula lock) |

### Step 12 — Documents & uploads

| ID | Document | Why |
|----|----------|-----|
| `shopAddressProof` | Shop / unit address proof | Checklist |
| `bankStatements` | Bank statements (≈6 months) | Checklist |
| `machineryQuotations` | Equipment / stock quotations | Capex proof |
| `aadhaarPan` | Aadhaar / PAN | KYC |
| `udyamCertificate` | Udyam (recommended) | Registration path |
| `mudraClosure` | Prior Mudra closure | **Tarun Plus only** |

---

## 5. Not in the MUDRA catalog

Omit these (multi-unit CFC / subsidy overlays):

- Value chain / gaps / SWOT / CFC plan  
- PMEGP category × rural/urban margin-money %  
- Implementing agency KVIC / KVIB / DIC  
- Heavy multi-year employment essays  

---

## 6. What must never appear on a MUDRA DPR

- Common Facility Centre (CFC) / SPV grids  
- “Government margin money / PMEGP subsidy” as the main finance story  
- Claiming MUDRA itself sanctions the loan (lenders do)

---

## 7. Maintenance

Any change to MUDRA Create New Latest DPR questions must update **this file**, `mudraQuestions.ts`, and `MUDRA_STEPS` in `schemeStepCatalog.ts` together.
