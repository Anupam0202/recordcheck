# Conditional submission copy — NOT SUBMITTED
Official sponsor statement, rubric, deliverables, video limit, team eligibility and AI/reuse rules are UNKNOWN. Do not submit this as compliant without mapping the pack.

## Project description
RecordCheck is a local-only prototype for reviewing drafted factual assertions against supplied text exhibits. It flags missing references, exact-quote gaps and literal date/amount differences, then records a human disposition tied to the exact source and draft revision. Editing a relevant source or claim invalidates that earlier disposition. It never automatically concludes that a claim is legally valid or semantically supported.

## Built in this session
TypeScript source, deterministic browser engine, synthetic fixture, revision-bound review UI, local JSON/Markdown exports, tests and a dependency-free Node build. No existing repository code copied. AI assistance used for research, implementation and synthetic test design; no lawyers, external experts or users were interviewed. Gemini is NOT connected and NOT used in the application.

## Architecture and limitations
Entire processing in browser memory; no external model or persistent server store. Manual claim and source selection, plain text/JSON only. Review identity is self-attested; hashes are not authenticity signatures. No PDF/Word integration or semantic verification. Tests are small synthetic engineering checks, not legal ground truth or general accuracy benchmarks. See actual EVALUATION.md for measured results.

## Judge questions
- “Why not Clearbrief?” Clearbrief is substantially broader and integrated with Word. Our hypothesis is low-friction local revision-aware review; superiority and unique competitor absence have not been established.
- “Is this AI?” Not at runtime. Deterministic checks are deliberately used for exact comparisons. AI extraction could be added only after approved data handling, budget and evaluation.
- “Can it verify my affidavit?” No. It can aid a bounded review of supplied factual text. It cannot establish truth, completeness or legal correctness.
- “Why this sponsor track?” UNKNOWN until the actual 2026 pack is supplied; do not invent a mapping.
- “What is deployed?” Nothing remotely by this run unless STATUS.md subsequently records actual verified URLs and commit. A local build is not a deployment or submission.
