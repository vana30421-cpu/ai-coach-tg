# LIFE OS — Product and methods benchmark

Research snapshot: 2026-11-08. This is a selection guide, not a claim that every feature from every app is useful or evidence-based. The product should combine proven mechanisms, preserve offline-first operation, and avoid feature bloat.

## Benchmarked product patterns

| Product / category | Useful pattern | LIFE OS decision |
|---|---|---|
| Todoist | Fast capture, natural-language dates, recurring tasks, filters, duration estimates, task breakdown | Keep a fast inbox; extend date parsing and recurring tasks only with tests; preserve task duration and checklist; add smart filters when the task model supports them cleanly |
| TickTick | Calendar views, habits, Pomodoro, Eisenhower matrix, focus/habit statistics, themes | Reuse the existing task matrix, calendar, habit tracking, focus timer and detailed statistics; unify them rather than create duplicate modules |
| Habitica / gamified habit apps | Immediate feedback, progress, rewards and visible milestones | Keep XP and pet rewards as optional reinforcement; never punish missed days or turn health into a competitive score |
| Anki / FSRS learning tools | Retrieval practice, spaced repetition, feedback on recall | Keep FSRS as the memory scheduler; make active recall and review quality more prominent than passive reading |
| Mindfulness / CBT apps | Mood self-monitoring, psychoeducation, relaxation, mindfulness, activity scheduling and structured exercises | Add short, clearly labelled practices and reflective prompts; never diagnose or present a chatbot as a therapist |
| Telegram Mini Apps | Mobile-first responsive UI, native theme adaptation, safe areas, smooth motion, haptics and device-aware effects | Respect Telegram theme/safe-area APIs, use haptics sparingly, keep animations lightweight and adapt particle counts to device capability |

## Evidence-informed methods selected

- **Habit formation:** self-monitoring, specific goals, stable cues, repeated action in the same context, positive reinforcement, and a deliberately small minimum action. A missed day is not treated as failure.
- **Learning and memory:** retrieval practice, spaced/distributed practice, feedback, and adaptive FSRS scheduling. Passive rereading is not the default.
- **Planning:** capture first, choose a small number of priorities, estimate task duration, time-block where appropriate, break complex work into next actions, and review plans regularly.
- **Focus:** Pomodoro is one available preset, not a universal rule. The user should be able to choose shorter or longer focus blocks and self-regulated breaks.
- **Wellbeing:** mood/energy/stress self-monitoring, brief mindfulness/grounding, activity scheduling and sleep routines. These are self-help tools, not clinical treatment.

## Implemented in this pass

- Habit editor now stores a stable cue/trigger, a minimum action for difficult days, and a small reward. Habit detail shows the personal plan.
- Task and habit completion can show a short particle burst.
- Visual theme effects have an explicit override for users whose operating system requests reduced motion; the default still respects the system accessibility preference.
- Fixed the all-time statistics period being silently treated as 30 days.
- Fixed FSRS review history aggregation so the reviews array is actually read.

## Important product guardrails

1. Do not blindly import every app feature. Duplicate dashboards, excessive streak pressure, noisy notifications, manipulative reward loops and unsupported medical claims are excluded.
2. The local Jarvis rule engine is not a general-purpose LLM. It may generate recommendations and apply reversible low-risk settings; deleting data, changing health/finance records, external purchases or device-level controls require explicit confirmation and/or a real permissioned integration.
3. All recommendations must state whether they are based on user-entered data, a rule, or an external AI model. Missing data must never be interpreted as a poor score.
4. Offline-first remains mandatory: core tasks, habits, learning, statistics and local recommendations must work without network access.
5. UI effects must be optional, performant, battery-aware, keyboard/accessibility friendly, and disabled when the user chooses reduced motion unless they explicitly override it.

## Public references

- Todoist task scheduling and natural-language dates: https://www.todoist.com/help/todoist/features/schedule-a-date-and-time-for-your-todoist-tasks-q7VobO
- Todoist recurring tasks: https://www.todoist.com/help/todoist/features/introduction-to-recurring-dates-YUYVJJAV
- Todoist filters: https://www.todoist.com/help/todoist/features/introduction-to-filters-V98wIH
- TickTick features (habits, Pomodoro, Eisenhower matrix, statistics, themes): https://www.ticktick.com/features
- Telegram Mini App design and performance guidance: https://core.telegram.org/bots/webapps
- Digital habit-formation interventions systematic review: https://pubmed.ncbi.nlm.nih.gov/38787601/
- Distributed practice meta-analysis (2025): https://pubmed.ncbi.nlm.nih.gov/40564553/
- Retrieval practice review: https://pubmed.ncbi.nlm.nih.gov/33006925/
- Spaced repetition systematic review and meta-analysis: https://pubmed.ncbi.nlm.nih.gov/41601436/
- Mental-health app elements meta-regression (169 trials): https://pubmed.ncbi.nlm.nih.gov/41807539/
- NIMH guidance on mental-health apps and evidence limitations: https://www.nimh.nih.gov/health/topics/technology-and-the-future-of-mental-health-treatment

## Next implementation stages

1. Verify and improve effects on real Android Telegram WebView and desktop browsers; measure frame time and memory before increasing particle density.
2. Improve task capture, task breakdown, recurring schedules and saved filters without changing existing task IDs or stored records.
3. Connect the learning dashboard to FSRS due cards, retrieval accuracy, confidence and retention trends.
4. Add a weekly review that converts measured friction into a small number of user-approved changes.
5. Expand Jarvis's explainable decision rules and audit log; use an external LLM only through a secure, opt-in backend with explicit permissions.
6. Add integration tests for migrations, offline reload, animation accessibility, task completion, habit cue persistence and FSRS statistics.
