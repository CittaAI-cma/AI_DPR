# DPDP — implemented product logic

> Living source of truth for **DPDP-related code** in this repo.  
> Plan / PDF (stages, legal caveats): [dpdp-implementation-plan.html](./dpdp-implementation-plan.html) · [dpdp-implementation-plan.pdf](./dpdp-implementation-plan.pdf)

**Maintenance:** Any change to DPDP behaviour (notice, consent, age 18, AI strip, audit, retention, grievance, under-18 copy) **must** update this file. Cursor rule: `.cursor/rules/dpdp-docs.mdc`.

This is **not** a legal opinion and **not** a DPDP compliance certificate. After Stages 1–3 the *code* can be as aligned as this product can get. Do not say “we comply with DPDP” until Stage 4 (contracts, named officer, real inbox, breach process).

---

## 1. Status

| Stage | What it is | Status |
|-------|------------|--------|
| 0 | Four locked notice lines | Locked (Sep 2026) |
| 1 | Notice, consent, age 18, safer AI, first audit | **In code** |
| 2 | Export, delete, nominee, complaint form, full audit UI | Not built |
| 3 | Private KYC storage, 12-month draft purge job | Not built |
| 4 | Legal name on paper, real grievance inbox, vendor contracts, breach playbook | Org work |

---

## 2. Locked Stage 0 (notice text)

Keep `PRIVACY_NOTICE_VERSION` in sync on **both** sides when the notice text changes.

| Decision | Value |
|----------|--------|
| Data Fiduciary (product name) | MSME One Department |
| Grievance email | `privacy.grievance@msmeone.gov.in` (**mock** until Stage 4) |
| Unused draft life | **12 months after last edit** (policy; not a statutory clock). Do not delete the whole account because one draft is old. Audit logs stay ≥ 12 months. |
| AI | Optional. KYC never in the model. If AI is off, say so: Fill with AI, model quality score, chat help will not run; type / save / download still work. |

Constants:

- Server: `server/src/lib/privacyNotice.ts`
- Client: `client/src/lib/privacy/constants.ts`

Current notice version: **`2026-09-1`**. Bump this string when the privacy page content changes so old users re-consent.

---

## 3. Stage 1 — what the code does

### 3.1 Notice page

- Public route: `/privacy`
- English / Telugu (follows UI language toggle)
- Linked from Register, Login, Layout footer, Landing footer
- **On Register and the re-consent popup the full notice is inside a scroll box.** The account-consent tick stays **disabled** until the user scrolls to the last line. Switching language resets the scroll and unchecks the box. Opening `/privacy` in a new tab does not skip this.

### 3.2 Consent on the user

Stored on `User.privacy`:

| Field | Meaning |
|-------|---------|
| `accountConsent` | Required to register / to pass the re-consent popup. **Cannot be ticked until the notice is scrolled to the end** (client). Server still requires `true`. |
| `aiAssist` | Optional. Server refuses AI routes if false |
| `analytics` | Optional; stored only |
| `noticeVersion` / `noticeAcceptedAt` | Which notice they agreed to |
| `dateOfBirth` | Register only; used to block under 18 |

JWT / profile payload includes `privacy.needsNoticeAcceptance` when `noticeVersion !== 2026-09-1`.

**APIs**

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/register` | Requires `dateOfBirth`, `accountConsent: true`, optional `aiAssist` / `analytics` / `noticeVersion` |
| POST | `/api/auth/login` | Returns privacy flags |
| POST | `/api/auth/consent` | Auth required. Re-consent / change AI flag |
| POST | `/api/auth/logout` | Auth required. Audit only |
| GET | `/api/auth/profile` | Public user + privacy (no password) |

Old users: blocking modal (`ConsentGate` on every `ProtectedRoute`) until they accept. Logout is the only way out without accepting.

### 3.3 Under 18

DPDP: under 18 cannot give adult consent. Product rule: the **named entrepreneur / applicant** must be 18+. No child-as-borrower DPR.

| Surface | Behaviour |
|---------|-----------|
| Register | DOB → age &lt; 18 → **no account**. Code `UNDER_18`. Guardian message. |
| Latest DPR extras | `entrepreneurAge` / `promoterAge` / `applicantAge` / `age` &lt; 18 → no save, no generate, no Fill-all-AI. Banner. |
| Server draft / generate | Same payload check on `/api/dpr/cluster/draft/save` and `/api/dpr/cluster/generate` |
| Scheme Finder | Age question and results show guardian copy. Create-DPR buttons hidden if `age === under18`. Loan schemes already fail the 18+ test. |

Copy lives in i18n `privacy.guardianMessage` (EN/TE) and server `GUARDIAN_MESSAGE`.

### 3.4 Safer AI

1. **Consent gate:** `requireAiConsent` on all `/api/ai/*` and AI DPR routes (suggestions, fill, generate, quality, translate, chat, RAG search, image gen, etc.). Draft save and PDF/DOCX download stay ungated.
2. **Strip KYC:** every `openai.chat.completions.create` goes through `server/src/lib/openaiClient.ts` → `sanitizeForAi` (drops Aadhaar/PAN/passbook/UPI/file URL keys; redacts Aadhaar/PAN patterns and Cloudinary/upload URLs in strings).
3. **UI:** Fill-all and per-step AI suggestions disabled + warning when `aiAssist` is false. 403 body uses `AI_CONSENT_REQUIRED`.

Generate that still calls OpenAI (including Latest DPR `generateClusterDPR`) **requires AI consent**. Preview of the live form does not.

### 3.5 First audit (append-only)

Collection: `auditevents` (`AuditEvent` model). Nobody updates old rows.

Stage 1 actions: `register`, `login_success`, `login_failed`, `logout`, `consent_given`, `consent_withdrawn`, `notice_accepted`, `ai_call`.

Each row: time, userId (if known), role, action, optional targetType/targetId, IP. **Not** Aadhaar, **not** DPR text.

There is **no admin audit screen yet** (Stage 2). Inspect in MongoDB (see test section).

### 3.6 JWT

`getJwtSecret()` (`server/src/lib/jwtSecret.ts`). Production (`NODE_ENV=production`) **exits** if `JWT_SECRET` is missing or is a known dummy (`your-secret-key`, etc.). Dev may warn and use a local dummy.

---

## 4. Key files

| Area | Path |
|------|------|
| Notice constants | `server/src/lib/privacyNotice.ts`, `client/src/lib/privacy/constants.ts` |
| Age helpers | `server/src/lib/under18.ts`, `client/src/lib/privacy/under18.ts` |
| Sanitize + OpenAI wrap | `server/src/lib/sanitizeForAi.ts`, `server/src/lib/openaiClient.ts` |
| Audit | `server/src/models/AuditEvent.model.ts`, `server/src/services/audit.service.ts` |
| Auth | `server/src/controllers/auth.controller.ts`, `server/src/routes/auth.routes.ts`, `server/src/models/User.model.ts` |
| AI gate | `server/src/middleware/aiConsent.middleware.ts`, `server/src/routes/ai.routes.ts`, `server/src/routes/dpr.routes.ts` |
| UI | `client/src/pages/Privacy.tsx`, `Register.tsx`, `ConsentGate.tsx`, `ConsentFields.tsx`, `PrivacyNoticeScroll.tsx`, `GuardianNotice.tsx` |
| i18n | `client/src/i18n/locales/en.json` / `te.json` → `privacy.*` |

---

## 5. How to test Stage 1

Run **client** (`npm run dev` in `client`, usually http://localhost:5173) and **server** (`npm run dev` in `server`, usually http://localhost:5000) with MongoDB and `OPENAI_API_KEY` as you already do.

Use a **new email** for each register test so you do not fight old users.

### A. Privacy page

1. Open http://localhost:5173/privacy (logged out).
2. Toggle English / Telugu — body language should change.
3. Confirm it names **MSME One Department**, mock mail `privacy.grievance@msmeone.gov.in`, 12-month drafts, optional AI, under-18 guardian line.

### B. Register — adult, AI off

1. `/register`. Fill name, email, password, **date of birth 18+**.
2. The account tick is greyed until you **scroll the notice box to the bottom**. Then tick account consent. Leave **AI** unticked.
3. Register stays disabled until both scroll-complete and the tick. Submit → land on dashboard. No extra privacy popup (notice already accepted).
4. Open **Create New Latest DPR**, pick a scheme, fill unit name. **Generate all steps with AI** and **Get AI Suggestions** should be disabled / show the “AI will not work” warning.
5. Open **AI Assistant** (`/chat`), send a message → should fail with the AI-off message (toast).
6. You should still type fields, **Save draft**, and use the live preview.

### C. Register — adult, AI on

1. New email, DOB 18+, tick account **and** AI.
2. Latest DPR → Fill with AI / suggestions should run (needs a valid OpenAI key).
3. Chat should answer.

### D. Register — under 18

1. DOB that makes the person 16 (or any date &lt; 18 years ago).
2. Submit → **no account**. Yellow guardian box. Login with that email must fail (user was not created).

### E. Old user (re-consent)

1. Log in as an account created **before** Stage 1 (no `privacy.noticeVersion` in Mongo), **or** in Mongo set `privacy.noticeVersion` to `"old"`.
2. Dashboard should be blocked by **“Please review how we use your data”**.
3. You cannot tick agree until you **scroll the notice to the bottom**. Then tick account consent and **Agree and continue**.
4. Logout from the modal works without accepting.

Demo **Quick Test Login** (`jaa@gmail.com`) will hit this popup until that user accepts once.

### F. Latest DPR — promoter age under 18

1. Logged in as 18+ with any AI setting.
2. Open a scheme pack that has **Entrepreneur age**. Type `16`.
3. Guardian banner. **Save draft** and generate / fill-all should refuse.
4. Change age to `32` → save should work.

### G. Scheme Finder

1. `/venture-match`. On the **age** question, guardian box is visible.
2. Choose **Below 18 years**, finish the quiz.
3. Matches may be empty / loan schemes failed. **Create DPR** / **Generate DPR for this Match** must **not** appear.
4. Start again, choose 21–50, those buttons return.

### H. Audit (Mongo)

In the same DB the API uses:

```js
db.auditevents.find().sort({ at: -1 }).limit(20)
```

Expect `register`, `notice_accepted`, `consent_given` after a new signup; `login_success` / `login_failed`; `logout`; `ai_call` after a successful AI request (not when AI is refused). Rows must not contain Aadhaar numbers or DPR body text.

### I. JWT (production guard)

Do **not** point a production deploy at this app without `JWT_SECRET` set to a long random value. With `NODE_ENV=production` and no/weak secret, the server process should exit at startup.

---

## 6. What Stage 1 does not do

- Download my data / delete my account / nominee / in-app complaint form (Stage 2)
- Admin audit browser (Stage 2)
- Automatic 12-month draft purge and private KYC file storage (Stage 3)
- Real grievance inbox, gazette legal name, OpenAI/Cloudinary contracts (Stage 4)

---

## 7. What we may say after Stage 1

We may say: we tell people and ask before collecting; children are not applicants; AI does not get KYC; login and consent are logged.

We must **not** say: we comply with DPDP.
