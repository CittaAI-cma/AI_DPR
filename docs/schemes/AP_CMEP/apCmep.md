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
3–12. Location → … → cost → MoF → operating → financial projections (3 previous FYs + 5 projected FYs: sales, raw material, wages, power, net profit) → schedule  
13. Uploads: Udyam (or application), quotations, bank sanction path, AP domicile  

**UI:** AP CMEP uses its own form / live-DPR template (indigo state pack), distinct from PMEGP’s teal KVIC pack. Live DPR and the downloaded PDF use a stacked section-and-answer layout. Financial projections render as a year-column sheet (Rs. in Lakhs).

Update this file + `apCmepQuestions.ts` + `AP_CMEP_STEPS` together.
