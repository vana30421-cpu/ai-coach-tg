# LIFE OS repository instructions

## Repository scope
- Work only in `vana30421-cpu/ai-coach-tg`, default branch `main`.
- This file is the project instruction entry point. Read it before every implementation task.
- Preserve the existing offline-first architecture, stored state, IDs, and user data.

## Safe implementation
- Inspect the current implementation and actual state schema before changing a feature.
- Prefer additive migrations and backwards-compatible defaults. Never clear or silently reset user data.
- Do not claim automatic Android/Windows screen-time access, device control, clinical diagnosis, or external AI capability unless a real permissioned integration exists.
- Distinguish user-entered measurements from device-collected measurements and missing data from zero.
- Health and eye-comfort features are self-observation and habit support, not treatment. Surface appropriate professional-care guidance for persistent or urgent symptoms.
- Autopilot may only apply reversible low-risk preferences. Destructive actions, external actions, and changes to health/finance/task records require explicit user confirmation.

## UI and accessibility
- Keep mobile Telegram WebView and desktop browsers responsive.
- Keep offline core features usable without network.
- Respect reduced-motion preferences by default; provide an explicit override only when the user chooses it.
- Keep animations lightweight and battery-aware. Ensure controls have accessible labels and usable touch targets.

## Verification and release
- Read relevant tests and run/update them for behavior changes.
- For medium/complex changes add regression, boundary, migration and negative-path tests where applicable.
- Verify JavaScript syntax and all available GitHub Actions checks before claiming success.
- Bump service-worker cache and asset query versions for deployable front-end changes.
- Do not claim a Pages deployment is live until its deployment workflow succeeds and the live URL reflects the release.
- Keep research claims sourced and separate evidence-based methods from product conventions or hypotheses.
