# CGTMSE — DPR format & form questions

> Scheme code: `CGTMSE`  
> Credit Guarantee Fund Trust for Micro and Small Enterprises — **MUDRA-adjacent** bank guarantee overlay (no separate `MUDRA_ADJACENT` code in-repo).

**Related app files:** `CGTMSE_STEPS`, `cgtmseQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

Banks need a **viability DPR** to sanction MSE credit without collateral; CGTMSE cover is taken by the MLI. `governmentGrant` is usually **0**.

Create New Latest DPR uses its **own 12 consecutive steps** (MUDRA-like bank pack).

---

## 2. Reference URLs

| # | Name | URL |
|---|------|-----|
| 1 | CGTMSE | https://www.cgtmse.in |
| 2 | AP MSME One FAQ | https://apmsmeone.ap.gov.in/Public/Schemes.aspx?ID=CGTMSE |

Confirm women-owned cover % with the lender.

---

## 3. Product rules (quick)

| Rule | Value |
|------|--------|
| Who | MSE seeking collateral-free bank credit |
| Focus | Loan purpose + women-owned (cover %) |
| Grant | Usually 0 — guarantee is bank-side |

---

## 4. Form questions (12 steps)

1. Cover (`loanPurpose`, `womenOwned`, `entrepreneurName`, `proposedLimit`)  
2–11. Story → … → cost → MoF (grant 0) → operating → viability  
12. Uploads: Udyam, Aadhaar/PAN, quotations / WC evidence  

Update this file + `cgtmseQuestions.ts` + `CGTMSE_STEPS` together.
