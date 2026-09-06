# Evaluation — measured local results

Run: 2026-09-06T03:43:39.190Z

## Core experiment
- 9 synthetic cases; 9 matched the declared structural/policy signal sets.
- 7 cases with planted structural/policy issues: MVP flagged 7; source-ID-exists baseline flagged 2. This is NOT legal accuracy and NOT a comparison with a strong LLM or actual competitor.
- 5 relevant source/claim/matter mutation cases: 5 prior dispositions invalidated; the citation-exists baseline retained 5.
- Semantic counterexample C6: literal checks did NOT detect the wrong conclusion. It remained human-review-required. Zero claims are automatically certified supported.
- Local Node engine latency: 40 runs of 6 claims; median 0.45 ms, p95 1.10 ms. No model/network/render overhead included.
- External model calls/tokens/cost: 0 / 0 / $0. Time saved by an actual legal reviewer: UNMEASURED.

## Separate engineering gates
Unit test, typecheck, browser and security outcomes are recorded in STATUS.md and qa-results.json after execution, not inferred from this evaluation.

## Limitations
All labels were authored by the same assistant, not lawyers. Synthetic mechanism tests have limited coverage. The seeded semantic contradiction illustrates a real capability boundary. No live Gemini or competent-user LLM baseline was available; no rate-limit/timeout integration test is claimed. No direct Clearbrief/Bundledocs/Clio test or adoption interview occurred.
