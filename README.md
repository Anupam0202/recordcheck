# RecordCheck
A local-only factual-evidence review prototype. It flags mechanical gaps and binds self-attested human review to the exact matter, claim and source revision. **Not an AI lawyer, semantic verifier, filing tool, compliance certificate, or competition-ready submission.** Official 2026 sponsor fit remains unverified.

## Run instantly
Open `dist/index.html` in a current browser. It is self-contained and makes no network requests. If your browser does not expose secure hashing to local files, serve over localhost using the steps below. Load/reset the explicitly synthetic scenario; no keys required.

## Build and run from source
Node **24+** is required. There are **zero npm dependencies**; package installation is unnecessary. The dependency lockfile records that empty dependency tree.
```sh
npm run build
npm test
npm run evaluate
npm run security
npm start
```
Then visit http://127.0.0.1:4173. Stop with Ctrl+C. The build uses Node's built-in TypeScript stripping, which does NOT typecheck. `npm run typecheck` uses a separately available TypeScript compiler (validated with version 7.0.2); install it only in an authorized networked development environment if unavailable. The production build requires no TypeScript package.

## Three capabilities
1. Validate and import a small text/JSON matter, with exact 1-based inclusive line citations.
2. Flag missing source/lines, quote discrepancies and literal ISO-date/SGD-amount gaps. Every claim still needs human review.
3. Record review/exclusion with a meaningful reason, invalidate it when relevant inputs change, and export a packet including unresolved items.

## Demo, approximately three minutes
See docs/DEMO_SCRIPT.md. Start with C1 (wrong price), C2 (wrong delivery date), C3 (ordinary payment), C4 (missing exhibit), C5 (legal abstention), C6 (semantic counterexample). Review C3 then change E3: the recorded disposition becomes stale. No model outage can affect this core demo because no live model is used.

## Input and privacy
Only JSON working matters, maximum 200 KiB, 12 exhibits, 30 claims; copy the fixture for the schema. No PDF/OCR ingestion or automatic claim extraction. No network APIs, analytics, cookies, localStorage, IndexedDB, server upload or persistent matter store. Refresh loses unsaved work; export explicitly if desired. Downloads can contain sensitive material, so keep them within the approved audience. Synthetic/approved data only. Browser extensions, hosting environment and device security are outside this prototype's assurances.

## Boundaries that matter
A quote appearing at a location is NOT proof of the claim. No negation, identity, arithmetic, credibility, current legal validity or factual truth is established. C6 intentionally demonstrates this limitation. Reviewers are self-labeled, not authenticated; hashes bind content but are not signatures or authentic provenance. JSON imports clear approvals. Local activity is not a tamperproof audit trail.

## Deployment — blocked, not performed
A Vercel static-project configuration is included, but no GitHub repository or Vercel deployment was created. No credentials/approved destination were available. Never assume a preview is private: the current Vercel docs say a new project's first deployment is production, even without --prod.
1. Confirm exact owner/repository, branch, visibility, account/project, audience and production approval.
2. Use normal GitHub/Vercel secure sign-in, not credentials in chat or source.
3. Review licensing/rules and staged files; run tests/security checks; inspect Git history for secrets; preserve unrelated user work.
4. Import the dedicated approved repository into Vercel with Node 24, Other/static framework, `npm run build`, output `dist`. Set deployment protection before publication as appropriate to the authorized audience.
5. Verify remote logs, intended commit, page, deep link, mobile view and judge access. No Gemini secret is needed for this version.
Do not deploy or submit merely because this README includes steps. Submission requires separate authorization and official-field verification.

## Evidence
Product spec, limits, evaluation and demo documentation are under docs. Private research comparison is supplied separately and should not be committed publicly without approval. Vendor feature descriptions were not independently benchmarked. No user interviews or lawyer validation occurred.

## Optional browser QA tooling
The recorded browser run used Playwright 1.63.0 and the installed Linux `chromium` executable. They are optional QA tools, not bundled runtime dependencies. In a suitably authorized development environment with those tools installed, start the local server and run `node scripts/browser-qa.mjs`. A separate linter is not configured; Node syntax checks and TypeScript checking were run instead.
