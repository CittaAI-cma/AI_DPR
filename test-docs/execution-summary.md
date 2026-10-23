# Final execution summary

Branch `feature/application_testcases`. Run on the isolated QA stack (API :5055, DB `msme-dpr-qa`). No production code was changed.

## Browser engine and screen sizes
The browser suite now runs on **Playwright** (it was Puppeteer). `E2E_BROWSER` picks Chromium or WebKit (Safari's engine) and `E2E_DEVICE` picks phone 360, tablet 768, laptop 1280 or desktop 1440. The full matrix of 8 combinations was run: desktop, laptop and tablet were clean on both engines; phone found BUG-016 and BUG-017 (fixed) and a test-side issue (drag needs a tall window); after the fixes the phone smoke file is 69/69 on both engines. **Firefox could not be run**: Playwright's Firefox fails to start on this Mac (a graphics crash at launch, the same with every flag I tried), so Firefox is untested. WebKit does not Tab to links by default, so KEY-001 focuses the skip link directly on WebKit.

## Results (real runs)
| Suite | Pass | Fail | Known-bug (todo) |
|---|---|---|---|
| Browser e2e (`e2e/`, 10 files, each run in its own process) — after the fixes | 176 | 0 | 0 |
| Server unit/contract (`npm test`) | 106 | 0 | 0 |
| Server live: api 3, rbac 9, security 10, finance 4, support 4, admin 13, session 6, pdf 1, encryption 4 | 54 | 0 | 0 |

"Known-bug" means the check ran and failed because of a confirmed defect (see `bug-report.md`); it is reported as `todo`, not hidden. Per-test outcomes: `test-cases.md`.

## Defects: 15 found, 15 fixed (2 high)
Before the fixes the browser suite was 160 pass with 16 known-bug todos; after fixing, every todo became a pass (see `bug-report.md`, "What was changed").
High: BUG-009 (another user's project can be overwritten), BUG-001 (Mongo reconnect loop leaks connections; it took down MongoDB twice and hit the QA stack again during this audit). Medium: BUG-007, 008, 010, 011, 012, 013, 014, 015 and a11y items 004–006; Low: 002, 003. Details and fixes: `bug-report.md`.

## Test-side problems fixed (not app bugs)
SESS-003 clock approach; AUTH-02x matched "403" inside data; VM-002 clicked a `position: fixed` button that the helper treated as hidden; ADM-002 assumed the user was on page 1; browser crashes now restart Chrome automatically.

## Not covered / mocked
AI is stubbed in browser tests; not tested: AI-guided builder, document/RAG upload, images/annexures, APMSME, support-desk UI, accept-invite UI, All-DPRs filters, DOCX/XLS content, email delivery, Chromium + WebKit only (no Firefox), no load/performance, no manual screen-reader pass. So coverage is **not** 100%; see the inventory's gap list.

## Needs your decision
1. Review the diff (`git diff`) and commit; nothing is committed yet.
2. Dev database: `node e2e/cleanup-dev-pollution.mjs --since 2026-10-22` is a dry run listing 17 throw-away `@msme.test` users (no projects/DPRs) written to the dev DB by my first run. Say the word and I run it with `--apply`.
3. Restart your own dev server (I stopped it while recovering MongoDB).
