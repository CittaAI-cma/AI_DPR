# PMFME — Detailed Project Report format & form questions

> Scheme code: `PMFME`  
> Source of truth for Create New Latest DPR when this scheme is selected.  
> Derived from MoFPI PMFME guidelines / portal DPR structure and **NIFTEM model DPRs** (official model project reports).

**Related app files:** `schemeStepCatalog.ts` (`PMFME_STEPS`), `pmfmeQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

PMFME (PM Formalisation of Micro Food Processing Enterprises) is a **credit-linked capital subsidy** scheme of MoFPI for **micro food processing** units (individual + groups). Create New Latest DPR targets the **individual micro-unit** path.

Approved-style packs are:

- **Food-process-first** (process flow, raw-material sources, FSSAI, capacity utilisation)
- **Numbers-first** (project cost + own ≥10% + MoFPI grant @35% capped ₹10 L + bank term loan)
- Free of multi-unit CFC / SPV grids (group / common-infra cases use a different portal path)
- Heavier than MUDRA — NIFTEM models include fixed capital, WC margin, MoF, P&L, repayment, DSCR, BEP

Create New Latest DPR uses its **own 14 consecutive steps** for `PMFME`.

---

## 2. Reference DPRs / forms (URLs)

PDFs are not stored in-repo (download from these URLs as needed):

| # | Name | URL | Why it matters |
|---|------|-----|----------------|
| 1 | PMFME official portal | https://pmfme.mofpi.gov.in/pmfme/#/Home-Page | Apply + Download tab (DPR Excel / manuals) |
| 2 | Scheme guidelines (English) | https://pmfme.mofpi.gov.in/pmfme/assets/PDF/Scheme%20Guidelines/SchemeGuidelines-English.pdf | DPR must cover cost, manpower, turnover, marketing, RM sources, P&L, cash flow |
| 3 | FAQs (revised, English) | https://pmfme.mofpi.gov.in/mis/assets/PDF/faq-documents/FAQs_Revised_English.pdf | 35% / ₹10 L cap; own ≥10%; new **or** existing; ODOP preferred not compulsory; DPR parts |
| 4 | Individual support guidelines (AP SNA extract) | https://www.pmfmeap.org/sites/default/files/2021-07/06_Guidelines%20for%20Support%20of%20Individual%20Micro%20Food%20Processing%20Enterprises%20under%20the%20PMFME%20Scheme.pdf | Portal sections: applicant → existing → proposed → financial → bank → uploads → declare |
| 5 | **NIFTEM model DPR — Kinnow Juice** | https://niftem-t.ac.in/pmfme/dpr-kjuice.pdf | Official model: glance, capacity util, FCI, WC, MoF (subsidy+own+TL), P&L, repayment, DSCR, BEP |
| 6 | **NIFTEM model DPR — Mixed Vegetable Pickle** | https://niftem-t.ac.in/pmfme/dpr-mvpickle.pdf | Same skeleton for pickle / spice-style unit |
| 7 | NIFTEM PMFME incubation / more model DPRs | http://niftem-t.ac.in/olapp/pmfme/web/incubation.php | Index: dairy/F&V, fish, grains & spices, MFP, etc. |
| 8 | AP MSME One — PMFME page | https://apmsmeone.ap.gov.in/Public/Schemes.aspx?ID=PMFME | State listing used in Scheme Finder brief |

**Portal DPR parts (individual):** Applicant details → Business details → Financial details → Lending bank → Upload documents → Declaration. Projected financials on the portal use a **7-year** format (per MoFPI FAQ).

---

## 3. Product rules (quick reference)

| Rule | Value |
|------|--------|
| Support | Credit-linked capital grant **@ 35%** of eligible project cost |
| Subsidy ceiling | **₹10 lakh** per individual micro unit |
| Own contribution | Minimum **10%** of project cost |
| Balance | Bank term loan (grant is credit-linked) |
| Who | New **or** existing micro food processing enterprises |
| ODOP | Preferred, **not compulsory** |
| Premises | Owned / rented / leased (lease should cover repayment period) |
| Formalisation | FSSAI (+ Udyam / GST where applicable) |
| DPR | Mandatory for individuals (DRP handholding on portal) |

Confirm live ceilings / ODOP list with SNA / pmfme.mofpi.gov.in before locking numbers.

---

## 4. Form questions (PMFME’s own 14 steps)

Catalog: `PMFME_STEPS` — consecutive **Step 1 … Step 14**.

### Step 1 — Cover & formalisation

| ID | Question | Why |
|----|----------|-----|
| `unitName` | Unit / enterprise name | Cover + portal *(synced to legacy wire `clusterName`)* |
| `natureOfBusiness` | Nature of food processing activity | Eligibility |
| `majorProducts` | Major products | Sales & capacity |
| `district` | District | ODOP + SNA routing |
| `location` | Unit address | KYC / site |
| `unitStage` | New \| Existing (upgrade / expansion) | Both eligible |
| `odopAligned` | Yes \| No — district ODOP product? | Preference flag |
| `fssai` | Already have \| Will obtain / draft | Formalisation |
| `entrepreneurName` | Applicant full name | Proprietor / promoter |
| `entrepreneurAge` | Age | Profile |
| `existingTurnover` | Existing annual turnover (₹ L) if upgrade | Portal “existing enterprise” |

### Step 2 — Introduction & process

| ID | Question | Why |
|----|----------|-----|
| `sectorType` | Sector / food category | Intro |
| `sectorDescription` | Short intro — what the unit processes | Narrative |
| `processOfManufacture` | Process of manufacture / value addition | NIFTEM models + bank |

### Step 3 — Location

| ID | Question | Why |
|----|----------|-----|
| `geography` | Brief location / raw-material catchment | Site + RM |

### Step 4 — Unit profile & capacity

| ID | Question | Why |
|----|----------|-----|
| `presentActivities` | Present / proposed activity summary | Glance |
| `yearOfEstablishment` | Start / commencement | Implementation |
| `productionCapacity` / `installedCapacity` | Installed capacity (e.g. kg/day) | Model core |
| `capacityUtilisationY1` | Capacity utilisation Year 1 (%) | Models use ramp (e.g. 60→70→80) |
| `technologyLevel` | Technology / process level | Technical note |
| `proposedWorkers` | Proposed workers (nos.) | Manpower in guidelines |

### Step 5 — Market, buyers & raw material

| ID | Question | Why |
|----|----------|-----|
| `targetMarket` | Target customers / marketing channels | Guidelines DPR list |
| `existingDemand` | Demand / offtake note | Sales justification |
| `rawMaterialSources` | Sources of raw material | Explicit in MoFPI DPR list |

### Step 6 — Premises & utilities

| ID | Question | Why |
|----|----------|-----|
| `name` | Premises / workshed / unit | Capex / rent |
| `landDetails` / `premisesType` | Own \| lease \| rent | FAQ property rule |
| `powerRequirements` | Power (HP / kW) | Technical / WC power estimate |

### Step 7 — Applicant / firm

| ID | Question | Why |
|----|----------|-----|
| `spvName` | Firm / proprietor name | Legal entity |
| `legalStatus` | Sole / partnership / company / other | Constitution |
| `address` | Correspondence / registered address | KYC |

### Step 8 — Project cost

| ID | Question | Why |
|----|----------|-----|
| `land` / `building` | Land development / building / civil (₹ L) | NIFTEM FCI |
| `machinery` | Plant & machinery (₹ L) | Quotes required |
| `utilitiesAndInfrastructure` | Other fixed assets / utilities (₹ L) | FCI |
| `preliminaryAndPreOperative` | Contingency / pre-operative (₹ L) | FCI |
| `workingCapitalMargin` | Working capital margin (₹ L) | MoFPI WC |
| *(derived)* | **Total project cost** | Must equal MoF |

### Step 9 — Means of finance (critical)

| ID | Question | Why |
|----|----------|-----|
| `spvContribution` | Own contribution (₹ L) — **≥ 10%** | Scheme rule |
| `governmentGrant` | PMFME capital grant (₹ L) — **35%**, **cap ₹10 L** | Credit-linked subsidy |
| `bankLoan` | Bank term loan (₹ L) | Balance |
| `otherSources` | Other sources (₹ L) | Rare |

**Rule:** own + grant + bank (+ other) = total project cost. Grant ≤ min(35% of eligible cost, ₹10 L). Own ≥ 10%.

### Step 10 — Operating cost & sales

| ID | Question | Why |
|----|----------|-----|
| Sales / RM / wages / power | Operating assumptions | Feeds P&L (portal gates net profit / DSCR) |

### Step 11 — Financial viability

| ID | Question | Why |
|----|----------|-----|
| Projected P&L / cash / repayment | Prefer **7-year** horizon | Portal format |
| DSCR / BEP / payback | Viability | Portal / bank (FAQ cites DSCR ≥ ~1.5 guidance for DRPs) |

### Step 12 — Implementation schedule

| ID | Question | Why |
|----|----------|-----|
| `startDate` / `endDate` / milestones | Setup to commercial production | Moratorium / monitoring |

### Step 13 — Employment & impact

| ID | Question | Why |
|----|----------|-----|
| Direct / indirect employment | Manpower | Guidelines + models |
| Short impact note | Formalisation / local offtake | Narrative |

### Step 14 — Documents & uploads

| ID | Document | Why |
|----|----------|-----|
| `machineryQuotations` | Machinery quotations | Capex |
| `premisesLease` | Land / premises lease or ownership | Premises |
| `fssaiDraft` | FSSAI (or draft / application) | Formalisation |
| `aadhaarPan` | Aadhaar / PAN | KYC |
| `udyamCertificate` | Udyam | Formalisation |
| `bankPassbook` | Bank account | Disbursement |
| `existingUnitPhotos` | Photos of existing unit (if upgrade) | FAQ for existing |

---

## 5. Not in the PMFME catalog

- Group / FPO / SHG / common-infrastructure CFC grids (use group portal path)  
- Multi-unit cluster SPV shareholding  
- Formal SWOT / value-chain / gap as separate vanilla steps (RM + market folded into Step 5)

---

## 6. What must never appear on a PMFME DPR

- Treating this as a non-food / trading-only case without processing  
- Claiming subsidy above **₹10 lakh** for an individual unit  
- Skipping FSSAI / formalisation path  
- Own contribution below **10%** of project cost

---

## 7. Maintenance

Update **this file**, `pmfmeQuestions.ts`, and `PMFME_STEPS` together when questions change.
