# AI_CONTEXT — LIFEOS

Before every code task, read:
1. `AGENTS.md`
2. `PROJECT_STATE.md`
3. `LIFEOS_COMPLETE_LEARNING_SPEC.md`
4. Relevant curriculum, RAD, and 50-app audit files.

## Working rules

- Repository: `vana30421-cpu/ai-coach-tg`; work in this repository and commit changes here.
- Preserve existing user data, state migrations, offline support, and Android/Telegram WebView compatibility.
- Diagnose the actual code path before editing. Never infer successful integration from the existence of a JavaScript file.
- For UI features, verify that the real navigation route calls the intended renderer and that the screen is not duplicated.
- Update asset versions and Service Worker caching whenever shipped browser assets change.
- Add regression tests for route wiring, persistence, spaced review, empty state, and failure cases.
- Do not call a feature complete merely because it appears in a plan or audit.
- Do not claim Android or Telegram WebView verification unless a real device/session was tested.
- Report CI results separately from manual device testing and deployment status.

## Content standards

- The 5,000 psychology units and 5,000 communication units are explicit targets, not current counts. Build unique, useful, source-backed items; do not inflate counts with duplicates or word substitutions.
- Each learning item should include a clear objective, explanation, example, exercise, retrieval question, answer explanation, mastery criterion, and source where applicable.
- Use active recall, spaced repetition, interleaving, feedback, and real-world application. Do not promise that five minutes can reliably replace a month of learning.
- RAD materials: use public sources and original summaries with attribution. Do not reproduce closed or paid courses. Distinguish creator opinions from independently supported scientific claims.
- Health, psychology, finance, and martial-arts content must include appropriate limits and safety guidance.
- Multimedia: SVG diagrams and interactive steps are useful offline components, but they are not a substitute for the requested complete video/photo library.

## Delivery standard

A task is complete only when code is integrated into real screens, state is safely persisted, tests pass, the deployment is confirmed when relevant, and remaining manual checks are stated clearly.
