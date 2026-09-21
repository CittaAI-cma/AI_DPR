# PM Vishwakarma — Detailed Project Report format & form questions

> Scheme code: `VISHWAKARMA`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from **PM Vishwakarma Guidelines** (MoMSME / MSDE / DFS) and PIB salient-features notes.

**Related app files:** `schemeStepCatalog.ts` (`VISHWAKARMA_STEPS`), `vishwakarmaQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

PM Vishwakarma is a **Central Sector** end-to-end support scheme for **traditional artisans / craftspeople** in **18 notified trades** — recognition, skill training, toolkit e-voucher, and **collateral-free enterprise development loans**. It is **not** PMEGP margin money and **not** a general MUDRA product.

Approved-style packs are:

- **Craft-first** (exact trade from the 18-list)
- **Tools-first** (current tools → ₹15,000 e-voucher kit)
- **Tranche-first** (₹1 L then ₹2 L enterprise loans at 5%)
- Free of multi-unit CFC / SPV / heavy industrial FCI grids
- Lighter than bank term-loan packs (PMEGP / Stand-Up) — home / rented workplace + tool + WC numbers

Create New Latest DPR uses its **own 12 consecutive steps** for `VISHWAKARMA`.

---

## 2. Reference guidelines / portals (URLs)

PDFs are not stored in-repo (download from these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | Official portal | https://pmvishwakarma.gov.in | Enrolment, benefits, FAQs |
| 2 | Scheme guidelines (eng v30) | https://pmvishwakarma.gov.in/cdn/MiscFiles/eng_v30.0_PM_Vishwakarma_Guidelines_final.pdf | Canonical eligibility, components, credit |
| 3 | PIB — salient features | https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1959098 | 18 trades + benefit summary |
| 4 | PIB factsheet (launch) | https://static.pib.gov.in/WriteReadData/specificdocs/documents/2023/sep/doc2023918253401.pdf | Outlay, CSC enrolment, tranche overview |
| 5 | NIMI — scheme about | https://nimi.gov.in/web/vishwakarma.html | Training / assessment context |

**Note:** There is **no** public library of filled sample DPRs for PM Vishwakarma. Shape = guidelines + CSC / bank enterprise-loan appraisal pack (craft, tools, sales, repayment for tranche tenor).

**Helpline:** 18002677777 · **Email:** pm-vishwakarma@dcmsme.gov.in

---

## 3. Product rules (quick reference)

| Rule | Value |
|------|--------|
| Who | Self-employed artisan in one of **18** family-based traditional trades (unorganised), working with hands & tools |
| Age | ≥ **18** on registration date |
| Family | **One** member per family (spouse + unmarried children); govt employees & their family **ineligible** |
| Prior credit | No similar central/state self-employment / business loan (e.g. PMEGP, PM SVANidhi, MUDRA) in last **5 years** |
| Recognition | PM Vishwakarma certificate + ID card |
| Skill | Basic training **5–7 days (~40 hrs)**; optional Advanced **~15 days / 120 hrs**; stipend **₹500/day** |
| Toolkit | Up to **₹15,000** e-voucher / e-RUPI after skill assessment (designated centres) |
| Credit — Tranche 1 | Up to **₹1 lakh**, tenor **18 months**, after Basic Training |
| Credit — Tranche 2 | Up to **₹2 lakh**, tenor **30 months**, if Tranche 1 is standard **and** digital transactions **or** Advanced Training |
| Interest | **5%** to beneficiary; GoI interest subvention up to **8%**; credit-guarantee fee borne by GoI |
| Digital incentive | ~₹1 per digital transaction (capped monthly — confirm live guideline) |

Confirm live rates / caps on pmvishwakarma.gov.in before locking numbers.

### 18 eligible trades (exact list for the form)

1. Carpenter (Suthar/Badhai)  
2. Boat Maker  
3. Armourer  
4. Blacksmith (Lohar)  
5. Hammer and Tool Kit Maker  
6. Locksmith  
7. Goldsmith (Sonar)  
8. Potter (Kumhaar)  
9. Sculptor (Moortikar, stone carver) / Stone breaker  
10. Cobbler (Charmkar) / Shoesmith / Footwear artisan  
11. Mason (Rajmistri)  
12. Basket/Mat/Broom Maker / Coir Weaver  
13. Doll & Toy Maker (Traditional)  
14. Barber (Naai)  
15. Garland maker (Malakaar)  
16. Washerman (Dhobi)  
17. Tailor (Darzi)  
18. Fishing Net Maker  

---

## 4. Form questions (VISHWAKARMA’s own 12 steps)

Catalog: `VISHWAKARMA_STEPS` — consecutive **Step 1 … Step 12**.

### Step 1 — Cover & craft eligibility

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Unit / workshop / trade name | Cover *(synced to legacy wire `clusterName`)* |
| `natureOfBusiness` | Nature of craft activity | Narrative |
| `majorProducts` | Major products / services | Sales |
| `district` | District | CSC / DIC / bank routing |
| `location` | Workplace address (home / shop) | KYC / site |
| `craft` | One of 18 trades (exact dropdown) | Hard eligibility |
| `entrepreneurName` | Artisan full name | KYC |
| `entrepreneurAge` | Age (≥ 18) | Eligibility |
| `experienceYears` | Years practising this craft | Profile |
| `currentTools` | Tools used today | Baseline |
| `newTools` | Tools to buy with ₹15,000 voucher | Toolkit component |
| `trainingStage` | Not started \| Basic done \| Advanced done | Credit gate |
| `loanTranche` | None yet \| First (₹1 L) \| Second (₹2 L) | MoF band |
| `priorSelfEmploymentLoan` | No similar loan in last 5 years? Yes / No | Hard gate |

### Step 2 — Trade story & process

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / trade type | Intro |
| `sectorDescription` | Short intro — what the artisan does | Narrative |
| `processOfManufacture` | Process of making / service delivery | Bank / appraisal note |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief location / customer catchment | Site feasibility |

### Step 4 — Craft profile

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Present activity summary | Glance |
| `yearOfEstablishment` | When practice / workshop started | Profile |
| `technologyLevel` | Tools / process level (traditional → upgraded) | Toolkit story |
| `productionCapacity` | Throughput if applicable (pieces / day, clients / week) | Ops note |

### Step 5 — Market & sales assumptions

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Target customers | Demand |
| `existingDemand` | Demand / footfall note | Sales |
| `marketingStrategy` | How products / services are sold | Linkages |

### Step 6 — Workplace / premises

| ID | Question | Why |
|----|----------|-----|
| `unitName` (shed) | Workplace name | Shed card |
| `landDetails` | Premises note | Light |
| `workplaceType` | Home \| Rented shop \| Own shop \| Other | Premises type |
| `powerRequirement` | Power (if any) — optional | Utilities |

### Step 7 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| `applicantName` | Firm / proprietor name | Usually same as artisan |
| `legalStatus` | Typically sole proprietor | Legal |

### Step 8 — Project cost

| ID | Question | Why |
|----|----------|-----|
| `machinery` | Tools / equipment (₹ Lakhs) | Toolkit + any other tools |
| `furniture` / utilities | Furniture & fixtures (₹ Lakhs) | Light |
| `workingCapitalMargin` | Working capital (₹ Lakhs) | Raw material / stock |
| Land / building | Usually **0** (hidden / optional for home workplace) | Lean capex |

### Step 9 — Means of finance (critical)

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own contribution (₹ Lakhs) | Margin |
| `governmentGrant` | Toolkit voucher (₹ Lakhs) — usually **0.15** max | ₹15,000 e-voucher |
| `bankLoan` | Enterprise development loan tranche (₹ Lakhs) | ₹1 L or ₹2 L |
| `otherSources` | Other (₹ Lakhs) | Rare |

Own + voucher + bank (+ other) should equal total project cost. Interest is **5%** concessional — not a capital subsidy beyond the toolkit voucher.

### Step 10 — Operating cost & sales

| ID | Question | Why |
|----|----------|-----|
| Operating cost fields | Raw material, wages, utilities, etc. | P&L |
| Sales / revenue | Year-wise sales | Repayment capacity |

### Step 11 — Financial viability

| ID | Question | Why |
|----|----------|-----|
| Cash flow / surplus | Simple viability for tranche tenor | 18 or 30 months |
| DSCR | If bank loan > 0 | Lender field |

### Step 12 — Documents & uploads

| ID | Upload | Why |
|----|--------|-----|
| `aadhaarPan` | Aadhaar | CSC biometric enrolment |
| `bankPassbook` | Savings bank passbook | Disbursement / stipend / loan |
| `rationCard` | Ration card | Family verification |
| `pmVishwakarmaId` | Certificate / ID (if issued) | Recognition proof |
| `toolkitQuotation` | Toolkit / tool list or centre quote | Supports voucher use |

---

## 5. Not in the VISHWAKARMA catalog

- Multi-unit CFC / SPV / cluster commons  
- PMEGP margin-money category tables  
- Heavy land / building FCI (unless the artisan really has a workshed capex)  
- Value-chain / SWOT / national-importance chapters from the vanilla 18  

---

## 6. Implementation checklist (app)

- [x] `VISHWAKARMA_STEPS` — 12 consecutive UI steps  
- [x] `vishwakarmaQuestions.ts` — extras, craft list, tranche helpers  
- [x] Form Step 1 eligibility + lean MoF note  
- [x] Uploads: Aadhaar, passbook, ration card (+ ID / toolkit quote)  
- [x] `hideComplexCapex` always on for this scheme  
- [x] Brief + `create-new-dpr-business-logic.md` row  

Update **this file**, `vishwakarmaQuestions.ts`, and `VISHWAKARMA_STEPS` together when questions change.
