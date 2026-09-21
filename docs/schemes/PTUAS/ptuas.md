# PTUAS — DPR format & form questions

> Scheme code: `PTUAS`  
> Pharmaceutical Technology Upgradation Assistance Scheme — **unit-level**, not cluster CFC.

**Related app files:** `PTUAS_STEPS`, `ptuasQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

Pharma **technology upgrade** with GMP / licence focus and full FCI + schedule.

Create New Latest DPR uses its **own 13 consecutive steps**.

---

## 2. Reference

Confirm live DoP / MoC&F PTUAS guidelines before locking subsidy %.

---

## 3. Product rules (quick)

| Rule | Value |
|------|--------|
| Who | Pharma manufacturing unit (brownfield upgrade) |
| Focus | GMP status + product licence |
| Pack | 13-step upgrade DPR (includes implementation schedule) |

---

## 4. Form questions (13 steps)

1. Cover (`gmpStatus`, `productLicence`, `entrepreneurName`, `existingTech`, `proposedTech`)  
2–12. Story → … → cost → MoF → operating → viability → **schedule**  
13. Uploads: manufacturing licence, pollution consent, quotations, CA FCI, Udyam  

Update this file + `ptuasQuestions.ts` + `PTUAS_STEPS` together.
