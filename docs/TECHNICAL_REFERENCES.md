# Technical reference checkpoint — 2026-09-06
No Gemini key, SDK or terminal internet available; no metered request authorized. Therefore model access, live behavior, latency and costs were NOT tested. No model is active in this build.
- Models: https://ai.google.dev/gemini-api/docs/models — retrieved page lists stable Gemini 3.8 Flash; `gemini-3.8-flash` appears in current examples. Documentation-observed candidate only, not account-access-verified. Do not reuse old 1.5/2.0 README defaults.
- Structured output: https://ai.google.dev/gemini-api/docs/structured-output — current examples use @google/genai Interactions API; schema-valid outputs still need value and source-support validation. SDK version could not be downloaded/verified.
- Grounding: https://ai.google.dev/gemini-api/docs/google-search — preserve returned attribution and search suggestions when enabled. Not enabled; never send confidential queries to public grounding.
- Pricing: https://ai.google.dev/gemini-api/docs/pricing — snapshot updated 2026-09-04. For gemini-3.8-flash standard, retrieved input price $0.75/1M through 2026-12-31; standard output row missing from focused extraction. Thus complete call price UNKNOWN, no cost estimate fabricated. Full-price recheck required before activation.
- Quotas: https://ai.google.dev/gemini-api/docs/rate-limits — active project limits must be inspected in AI Studio, not inferred from a key.
- Data: https://ai.google.dev/gemini-api/terms — unpaid data may improve products and undergo human review; do not send confidential/personal matter content. Paid data-use and retention assessment required before any live matters.
- Keys: https://ai.google.dev/gemini-api/docs/api-key — server-side environment only. This static build contains no key-reading logic and no model endpoint.
- GitHub/Vercel: https://vercel.com/docs/git/vercel-for-github — pushes can auto-deploy; inspect connected production branch before any remote write.
- Environments: https://vercel.com/docs/deployments/environments — FIRST DEPLOYMENT IS PRODUCTION even without --prod. Configure approved access/audience first. Preview label does not prove private access.
- Environment variables: https://vercel.com/docs/environment-variables — scope secrets and redeploy for changes. No secrets needed in this offline build.
- Limits: https://vercel.com/docs/functions/limitations — functions have 4.5 MB payload limit; fluid-compute Hobby max 300s in current docs. This static build uses neither functions nor serverless disk persistence.

Future authorized model plan: separate generation/evaluation/application model variables, initially empty; verify actual permitted models with minimal request after secure setup and budget approval. Do not claim multiple roles are independent validation. App model would extract candidate claims only; deterministic/source+human checks remain authoritative for handoff.
