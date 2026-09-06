# Product contract
## Status and falsifiable promise
For a litigation reviewer checking manually selected factual claims against supplied text exhibits, RecordCheck targets **zero accepted stale sign-offs after any relevant source/claim edit** against a citation-exists checklist baseline, while never automatically asserting semantic support or legal correctness. Zero is a TARGET until tested. Time saving and adoption are UNMEASURED.

## Three MVP capabilities
1. Import validated synthetic/approved text exhibits and claims; inspect exact line citations and local source revision fingerprints.
2. Flag missing references, quote mismatches, absent explicit ISO dates/SGD amounts; require meaningful human review even when mechanical checks pass. Legal propositions always abstain.
3. Bind review/exclusion to source+claim+matter revisions, invalidate after edits, and export a transparent review packet including unresolved items.

## Journey and states
Load synthetic scenario → examine issue list → inspect selected source lines with surrounding context → correct draft/source if appropriate → record reviewed/excluded disposition with a reviewer label and reason → change source to demonstrate stale status → export working matter and review report. Empty, parsing error, running/cancel, uncertain, blocked, reviewed and stale states are explicit. Reload clears local state. Exports are intentional and may contain matter content.

## Data and boundaries
Matter ID/title/jurisdiction; documents with unique ID/title/text; claims with ID/text, fact or legal kind, source ID, 1-based inclusive line range and optional exact quote. Review receipt contains fingerprint, disposition, reviewer, reason and timestamp. SHA-256 covers full cited document and claim plus matter context; this binds revisions, not authorship, authenticity or legal truth. Imported files never restore trusted approvals. No automatic legal/case-law validation. Dates/amounts only get literal checks, not arithmetic, negation, context or entity inference.

## Architecture
Small TypeScript browser application. Node 24 built-in type stripping build; no runtime libraries, network, paid APIs, database or server-side persistence. Local-memory processing. Strict schema limits: max 200 KiB JSON, 12 documents, 30 claims, 100,000 source characters total, 1,000 lines per document, bounded claim/range sizes. No URL fetch, PDFs, OCR, ZIP ingestion, analytics, markdown HTML rendering or client API keys.

## Safety and failure
Rendered text is escaped; file content never executes; imports validate before replacing state. Cancellation invalidates pending analysis. Unknowns remain review-required. No autonomous filing, messaging, truth certificate, digital signature, PDPA compliance or privilege guarantee. Synthetic demo clearly marked. No server model endpoint; network/timeout/rate-limit model tests are BLOCKED, not silently simulated as live tests.

## Acceptance mapping
Official requirements: UNKNOWN; mapping blocked pending pack.
User requirement → test: exact source provenance → line/quote tests; invalidation → source/claim/matter mutation tests; human control → blocked unreviewed export state; safe data handling → no outbound browser requests and no persistent browser storage; robust inputs → invalid types/duplicates/oversize/range tests; usability → desktop/mobile, keyboard, errors and empty state; deliverable → real build + source archive.

## Exclusions and roadmap
No automatic source extraction, legal reasoning, PDF/Word support, collaboration, authenticated reviewer identity, signed/tamperproof audit trail or live Gemini. Later: validate workflow with an actual legal reviewer; approved document parsing preserving source locations; optional server-side structured extraction with access/cost controls; existing Word integration only if worth the adoption overhead. More features are not substitutes for official fit.
