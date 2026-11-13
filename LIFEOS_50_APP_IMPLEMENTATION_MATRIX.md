# LIFEOS — 50-app implementation matrix

Updated: 2026-11-14  
Scope: translate `LIFEOS_50_APP_AUDIT.md` into concrete in-app work and acceptance criteria. This is a conservative repository-level assessment, not a claim of parity with the commercial products or device-level QA.

## Status legend

- **LOCAL CORE** — a usable local LIFEOS workflow exists for the main mechanic; this does not imply feature parity.
- **PARTIAL** — the foundation exists, but one or more important workflows, analytics, accessibility, or data links remain incomplete.
- **INTEGRATION** — requires an external service, permission, licensed content, or device API not currently wired into LIFEOS.
- **PLANNED** — no complete user workflow is confirmed in the current repository.

## Implementation matrix

| # | Reference app | LIFEOS destination / current foundation | Status | Remaining implementation and acceptance criteria |
|---:|---|---|---|---|
| 1 | Notion | Workspaces, projects, notes, goals, second brain | PARTIAL | Add linked views and relation integrity; create a task/project/note from any related record; edits remain consistent after reload. |
| 2 | Obsidian | Second brain, Markdown import/export, local storage | PARTIAL | Add safe bidirectional file sync with conflict resolution; prove no silent overwrite on concurrent edits. |
| 3 | Anytype | Workspaces and typed LIFEOS records | PARTIAL | Standardize object types and relations; export/import round-trip preserves IDs and links. |
| 4 | TickTick | Tasks, calendar, habits, focus timer | PARTIAL | Finish recurring rules, saved filters, task subtasks and calendar drag/resize; verify reminders and recurrence across timezone changes. |
| 5 | Todoist | Tasks and global quick capture | PARTIAL | Improve natural-language date parsing, recurring tasks, priorities and filter views; ambiguous dates require confirmation. |
| 6 | Habitica | XP, levels, achievements and pet progression | LOCAL CORE | Keep rewards optional and non-punitive; verify daily limits, idempotent XP and no penalties for missed habits. |
| 7 | Finch | Pet, wellbeing check-ins and gentle goals | PARTIAL | Add user-controlled self-care journeys and compassionate recovery prompts; missed days never reset progress or shame the user. |
| 8 | Fabulous | Routines and guided learning programmes | PARTIAL | Add adaptive routine sequences and skip/reschedule; completion must be persisted and editable without losing history. |
| 9 | Streaks | Habit tracking, history and heatmap | PARTIAL | Finish per-habit schedules, flexible cadence and accessible bulk editing; missed days must not erase history. |
| 10 | Coach.me | Goals, coach prompts, reviews and progress | PARTIAL | Link each goal to next actions and weekly evidence; review can be completed offline and survives reload. |
| 11 | Daylio | Mood log, trends and check-ins | LOCAL CORE | Add robust date filtering and export; charts must distinguish missing entries from zero and avoid diagnostic labels. |
| 12 | Stoic | Journal, evening review and reflection prompts | PARTIAL | Add prompt libraries and links from reflections to goals/tasks; preserve original journal entries during AI-assisted review. |
| 13 | Reflectly | Guided journal and reflection prompts | PARTIAL | Add optional guided flows with user-controlled tone; no mental-health diagnosis or coercive streaks. |
| 14 | Headspace | Antistress practices and guided steps | PARTIAL | Add a complete source-linked practice catalogue and audio only when original/licensed; stop controls and safety guidance must work. |
| 15 | Calm | Breathing, relaxation and sleep routines | PARTIAL | Improve bedtime routine templates and optional audio; avoid claiming treatment or guaranteed sleep improvement. |
| 16 | ChatGPT | Jarvis local assistant and protected optional Worker | PARTIAL | Verify end-to-end provider calls, privacy controls, context boundaries and error recovery; local commands must still work offline. |
| 17 | Gemini | Gemini provider through the protected Jarvis Worker | PARTIAL | Complete deployed Worker configuration and live POST verification; API keys remain server-side and wrong origin/access code is rejected. |
| 18 | Claude | Provider abstraction target | INTEGRATION | Add only through the shared protected Worker contract; test key isolation, timeout, rate-limit and provider failure paths. |
| 19 | Mem | Second brain, local search and contextual Jarvis | PARTIAL | Improve automatic related-note suggestions with explainable links; suggestions never rewrite source notes. |
| 20 | Capacities | Workspaces and typed objects | PARTIAL | Add templates for people, books, projects and meetings; relationships remain stable through export/import. |
| 21 | Readwise | Learning sources and second-brain notes | PLANNED | Add user-driven highlights import and source attribution; imported excerpts retain original URL and author metadata. |
| 22 | Anki | Active recall, course quizzes and spaced reviews | PARTIAL | Move to a validated FSRS scheduler with migration tests; due dates and recall outcomes persist across devices/imports. |
| 23 | RemNote | Learning content linked to notes and reviews | PARTIAL | Connect notes to lesson-derived flashcards; edits to a source note must not duplicate or silently rewrite cards. |
| 24 | Heptabase | SVG concept maps and visual learning explanations | PARTIAL | Add movable/linkable knowledge cards and export; visual maps must remain readable on narrow screens and offline. |
| 25 | Logseq | Journal, daily notes and backlinks | PARTIAL | Add block references and backlink navigation; deleting a reference must not delete its source record. |
| 26 | LifeUp | XP, levels, achievements and pet | LOCAL CORE | Keep gamification opt-in; verify reward limits, audit history and no negative health/finance incentives. |
| 27 | SuperBetter | Challenges, detox programmes and small actions | PARTIAL | Add user-defined quests and recovery paths; missed tasks never punish or reset completed work. |
| 28 | Lifesum | Wellbeing and personal routines | PLANNED | Build only a non-clinical food-habit journal if explicitly needed; manual records must be labelled and editable. |
| 29 | MyFitnessPal | No confirmed macro/nutrition workflow | PLANNED | Any nutrition tracker needs verified food data, units, locale and privacy controls; no invented calorie estimates. |
| 30 | Sleep Cycle | Manual sleep log, history and 7-day trends | PARTIAL | Keep manual data distinct from sensors; verify create/edit/delete on Android and Telegram WebView, timezone-safe history and export. |
| 31 | Forest | Shared focus timer, session history and weekly metrics | LOCAL CORE | Add optional session goals and distraction notes; actual elapsed time, partial stops and completion state must remain accurate. |
| 32 | Brain.fm | No licensed focus-audio integration | INTEGRATION | Use only licensed audio or user-owned tracks; offline timer must remain independent of streaming. |
| 33 | Elevate | Learning games and cognitive practice | PARTIAL | Add varied, validated exercise types and difficulty calibration; report task performance, not IQ or generalized intelligence. |
| 34 | Peak | Memory and cognitive games | PARTIAL | Add a broader exercise set and stable personal baselines; account for practice effects in analytics. |
| 35 | Lumosity | Cognitive games and performance history | PARTIAL | Improve diversity, adaptive difficulty and transparent scoring; never present game scores as clinical assessments. |
| 36 | Waking Up | Guided self-reflection and wellbeing practices | PARTIAL | Add optional secular guided practice sequences and original/licensed audio; user can stop or skip any step. |
| 37 | Structured | Calendar, schedule and day planning | PARTIAL | Finish 15/30/60-minute grid, drag/resize, templates and ICS; preserve school and sport commitments during auto-planning. |
| 38 | Sunsama | Daily planning and evening shutdown review | PARTIAL | Add daily capacity estimate and unfinished-task rollover; rollover requires user control and does not duplicate tasks. |
| 39 | Motion | Rule-based adaptive scheduling | PLANNED | Implement preview-first scheduling based on duration, priority and availability; no calendar changes without confirmation. |
| 40 | Akiflow | Global quick capture and search | PARTIAL | Add unified inbox triage and keyboard shortcuts; captured items must keep source and timestamp. |
| 41 | Things 3 | Areas, projects and next actions | PARTIAL | Add area/project hierarchy and next-action constraints; moving a project preserves all task links. |
| 42 | Microsoft To Do | Task lists, reminders and recurring work | PARTIAL | Finish recurrence editor, list filters and import/export; reminder limitations are clearly disclosed. |
| 43 | Google Calendar | Local calendar and event reminders | INTEGRATION | Add permissioned OAuth sync and conflict handling; no event is uploaded or modified without explicit authorization. |
| 44 | Apple Health | No native Apple Health connector in this PWA | INTEGRATION | Only add a permissioned bridge/import; retain source, timestamp and measurement provenance. |
| 45 | Garmin Connect | No confirmed wearable sync | INTEGRATION | Add official/export-based import only; sensor measurements remain separate from manual entries. |
| 46 | Strong | Exercise and training records | PARTIAL | Add structured sets/reps/load and history if the current training screen lacks them; validate units and editable session records. |
| 47 | Hevy | Training templates and progress | PARTIAL | Add reusable templates and volume trends; edits preserve prior workout records and do not invent measurements. |
| 48 | Fitbod | Adaptive training load | PLANNED | Any adaptive suggestions must use actual logged history, recovery context and user confirmation; never prescribe through injury. |
| 49 | Yazio | Nutrition goals and food tracking | PLANNED | Requires a verified food database and locale-specific units; no universal or medical diet recommendations. |
| 50 | Waterllama | Water log and quick-add actions | LOCAL CORE | Add editable personal target and trend view; avoid universal hydration prescriptions and duplicate taps. |

## Release gates

1. Every row marked LOCAL CORE or PARTIAL must have a real navigation route, persisted state, empty state, offline behavior and regression coverage.
2. Every INTEGRATION row must remain visibly unavailable until permission, credentials and a real round-trip test succeed.
3. PLANNED items are not presented as implemented in the UI or marketing.
4. Do not copy proprietary branding, closed course content, paid media or private APIs.
5. Run migration tests against legacy localStorage fixtures before changing stored schemas.
6. Complete Android Chrome and Telegram Android WebView manual QA before claiming full release readiness.

## Immediate execution order

1. **P0 reliability:** sleep input, focus timer, save/restore, offline reload and navigation on mobile.
2. **P1 daily system:** calendar grid/recurrence, task capture/filters, reminder snooze and ICS.
3. **P1 knowledge:** second-brain relations, safe import/export and source-linked learning reviews.
4. **P2 training:** structured workout logs, cognitive-game variety and source-backed curricula.
5. **P2 integrations:** Jarvis provider live test, then calendar/wearable integrations only with explicit permissions.
6. **Content/media:** psychology and communication units in deduplicated reviewed batches; original/licensed media only.

Last repository-level verification: LIFEOS checks passed 263/263 and Pages deployment succeeded on commit `f6ef995449e36789bb72b1789c2006e351a192e9`. Android/Telegram device QA is still outstanding.
