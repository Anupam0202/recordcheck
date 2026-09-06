# Acceptance checklist — 2026-09-06 09:15:36 IST

## Local engineering gates
- [x] TypeScript strict typecheck with installed compiler 7.0.2 (build alone does not typecheck).
- [x] 43/43 Node unit/regression tests passed; log in TEST_RUN.txt.
- [x] Node 24 dependency-free production build completed; index fingerprint in dist/build-info.json.
- [x] 19 local Chromium E2E checks passed; zero browser errors and external requests in the final suite.
- [x] HTML opens directly from a local file and via local HTTP; index.html deep link works.
- [x] Real source/claim editing, human review, stale invalidation, safe JSON import and Markdown export exercised.
- [x] Invalid input, injected HTML, empty state, missing evidence and unsupported legal claims tested.
- [x] Matter replacement clears earlier review/activity; prototype-like claim IDs do not inherit phantom reviews.
- [x] Ten layout/state images individually inspected; final dark placeholder contrast rechecked.
- [x] 390px mobile widths have no horizontal overflow; keyboard focus and explicit labels tested.
- [x] 13 chosen contrast pairs meet their declared 4.5:1 text or 3:1 input-boundary thresholds. Not a full WCAG audit.
- [x] Working matter import never restores trusted review records.
- [x] Input parsing/hashing/cancellation bounded; no persistent browser storage or model endpoint.
- [ ] ESLint/linter — not configured. Type checking, syntax checks and tests are separate gates.

## Empirical mechanism checks
- 9 synthetic cases, 9 expected structural/policy signal sets matched.
- 7/7 planted issue cases flagged versus 2/7 for source-ID-exists baseline.
- 5/5 source/claim/matter revision changes invalidated old review; simple baseline kept all 5.
- Semantic counterexample C6 NOT detected as contradictory by deterministic checks; still requires human review. No automatic support certification.
- Local engine latency measured separately; not a measured lawyer productivity improvement.

## Critical held/blocked gates
- [ ] Exact 2026 sponsor fit, rubric, team eligibility, AI/IP/reuse rules: UNKNOWN, sponsor pack not provided.
- [ ] Real reviewer value/time-saving study and strong LLM/actual competitor comparison: NOT RUN.
- [ ] Live Gemini, model access, rate-limit/timeout response tests: BLOCKED; no key/network/spending approval. No simulated live results claimed.
- [ ] GitHub remote write/visibility approval and authentication: BLOCKED.
- [ ] Vercel account/project/audience/production approval and authentication: BLOCKED.
- [ ] Remote build, deployed API, deployed commit and judge access verification: NOT PERFORMED.
- [ ] Competition submission: NOT ATTEMPTED; no forms/terms accepted.

## Bugs found and corrected before packaging
1. Currency regex backtracked at a sentence-final period and truncated grouped digits. Fixed numeric continuation checks; six explicit regression tests added and browser amount-message assertion passed.
2. Prototype-like claim IDs could inherit an object property as a phantom review. Null-prototype UI review map and own-property guards added, with tests.
3. Matter changes could retain prior source IDs in the session activity list. Reset/import/clear now clear earlier activity; browser isolation test passed.
4. Browser harness initially matched inline script text for loading state and later observed a favicon 404. Harness scoped to status region, server favicon response fixed, and final suite checked errors after all navigations.

No discovered blocker was relabeled as a passing legal, deployment or competition gate.
