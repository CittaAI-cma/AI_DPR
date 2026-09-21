# Coir Vikas Yojana — DPR format & form questions

> Scheme code: `CVY`  
> Source of truth for Create New Latest DPR when Coir Vikas Yojana is selected.

**Related app files:** `CVY_STEPS`, `cvyQuestions.ts`, `schemeFormConfig.ts`, `IndividualDPRForm.tsx`

---

## 1. Why this format

Coir Board–linked **unit-level** coir support — bank-unit pack, not a cluster CFC.

Create New Latest DPR uses its **own 12 consecutive steps**.

---

## 2. Reference URLs

| # | Name | URL |
|---|------|-----|
| 1 | Coir Board / Coir Vikas Yojana | Search coirboard.gov.in |
| 2 | MoMSME coir schemes | msme.gov.in |

Confirm live GOs before locking subsidy %.

---

## 3. Product rules (quick)

| Rule | Value |
|------|--------|
| Who | Coir product unit (fibre, yarn, pith, products) |
| Focus | Coir Board status + product line |
| Pack | 12-step bank-unit DPR |

---

## 4. Form questions (12 steps)

1. Cover & eligibility (`coirProductLine`, `coirBoardStatus`, `entrepreneurName`, `premisesType`)  
2. Business story  
3. Location  
4. Unit profile  
5. Market & sales  
6. Premises  
7. Applicant  
8. Project cost  
9. Means of finance  
10. Operating cost & sales  
11. Financial viability  
12. Uploads: Coir Board docs, quotations, Udyam  

Update this file + `cvyQuestions.ts` + `CVY_STEPS` together.
