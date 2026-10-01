# AP CMEP — DPR format & form questions

> Scheme code: `AP_CMEP`  
> Credit-linked back-ended subsidy for new mfg / knowledge units — **bank loan required**.

**Related app files:** `AP_CMEP_STEPS`, `apCmepQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

Greenfield **credit-linked** pack — zero-loan projects are out of scope.

Create New Latest DPR uses its **own 13 consecutive steps**.

---

## 2. Reference

Confirm live CMEP GOs / AP Industries notifications for subsidy % and booster categories.

---

## 3. Product rules (quick)

| Rule | Value |
|------|--------|
| Who | New mfg or knowledge enterprise in AP |
| Focus | Activity band + booster (woman / PwD / ex-serviceman / transgender) |
| Loan | Mandatory — bank-linked |

---

## 4. Form questions (13 steps)

1. Cover (`activityBand`, `boosterCategory`, `apDomicile`, …)  
2. Executive summary & process (`executiveSummary`, `processOfManufacture`, sector intro)  
3–12. Location → … → cost (incurred / to incur, machinery list) → loan terms and subsidy → operating assumptions → financial projections (3 previous FYs + 8 projected FYs) → schedule  
13. Uploads: Udyam (or application), quotations, bank sanction path, AP domicile  

**UI:** AP CMEP uses its own form / live-DPR template (indigo state pack), distinct from PMEGP’s teal KVIC pack. Live DPR and the downloaded PDF use a stacked section-and-answer layout. Financial projections, depreciation, DSCR, break-even, and the repayment summary render as sheets. AI may answer only the fields on the current step. It must not invent questions.

---

## Why these extra questions are only on AP CMEP

A Mangalagiri handloom bank report was compared with the schemes it could fit. CMEP is the credit-linked margin-money programme, so the form now also asks what changes the subsidy or the bank model:

- Urban or rural, EDP done or pending, any earlier subsidy, and one person in the family.
- Product share and selling price, loom or machine count, shifts, and utilisation for each projected year.
- Raw materials, staff by role and monthly pay, workshop area, lease period, and water or dye waste.
- Working capital built from stock, work in progress, finished goods, receivables, cash, and supplier credit.
- On each machine: GST, transport, installation, life, and yearly maintenance.
- A short risk table, plus uploads for the education certificate, EDP certificate, lease, yarn and dye rates, and dealer enquiries.

Subsidy amount, DSCR, break-even, depreciation, and sensitivity cases stay calculated. They are not questions. Every other Latest DPR scheme now gets the shared bank tables: product mix, machinery list, bank name, interest, moratorium, tenure, raw materials, and staff by role. Furniture, security deposits, and the CMEP eligibility gates stay on the schemes that already had them.

Update this file + `apCmepQuestions.ts` + `AP_CMEP_STEPS` together.
