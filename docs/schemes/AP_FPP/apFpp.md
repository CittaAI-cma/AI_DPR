# AP Food Processing Policy 4.0 — DPR format & form questions

> Scheme code: `AP_FPP`  
> State FCI capital subsidy for food processing. **Do not double-claim** with `AP_EDP` on the same FCI.

**Related app files:** `AP_FPP_STEPS`, `apFppQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

Food-unit **capital subsidy** pack with size / special-category / FPO-SHG inputs driving indicative grant.

Create New Latest DPR uses its **own 13 consecutive steps**.

---

## 2. Reference

AP MSME One / Food Processing Policy 4.0 (2024–29) and 2025 amendment — confirm live % and caps with GM-DIC.

---

## 3. Product rules (quick)

| Rule | Value |
|------|--------|
| Who | Agri / food processing in AP |
| Focus | Enterprise size + special category / FPO-SHG |
| Stacking | Mutually exclusive with AP_EDP capital subsidy on same FCI |

---

## 4. Form questions (13 steps)

1. Cover (`enterpriseSize`, `specialCategory`, `apDomicile`, `fpoShg`, …)  
2–12. Story → … → FCI cost → MoF → operating → viability → schedule  
13. Uploads: Udyam, FSSAI, CFE/CFO, quotations, CA FCI, AP domicile  

Update this file + `apFppQuestions.ts` + `AP_FPP_STEPS` together.
