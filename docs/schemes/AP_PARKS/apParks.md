# AP MSME-PARKS — DPR format & form questions

> Scheme code: `AP_PARKS`  
> APIIC park land allotment / **rebate-focused** pack — MoF shows land cost net of rebate.

**Related app files:** `AP_PARKS_STEPS`, `apParksQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

Park allotment note emphasising **plot + rebate category**, not a full factory CFC.

Create New Latest DPR uses its **own 10 consecutive steps**.

---

## 2. Reference

Confirm live APIIC / AP MSME Parks GOs for rebate %.

---

## 3. Form questions (10 steps)

1. Cover (`apiicParkName`, `plotArea`, `landRebateClaim`, `scStOrWomen`, `apDomicile`)  
2–9. Story → location → unit → market → premises → applicant → land/project cost → MoF  
10. Uploads: allotment / application, domicile, category proof  

Update this file + `apParksQuestions.ts` + `AP_PARKS_STEPS` together.
