# Tasks

> Read when: starting a session. Take the first task not done (or the one the owner names), at most 1-3 per session.
> Read only what its "Read" column lists, plus README.md. A task is done only when every "Done when" check was run
> and its real output pasted in your report.

Status: the owner adds "✓" after a task's id once it passed the owner's check (README.md), e.g. "T0 ✓". Only the
owner does this. A task without ✓ is not done, whatever a report says.

Code folders mirror the plan: `data/`, `engine/`, `output/`, plus `server/` (routes, storage, worker; from stack.md
and app/routes.md). Tests sit next to the code they test. Test files F1-F5 live in the code repo's test folder.
Every check below uses F1-F5 (demo-day.md); never only the sample.

## Stage 0: ground (do first)
| ID | Task | Read | Done when |
|---|---|---|---|
| T0 | Project skeleton: start command (serves /api/health on 127.0.0.1), test command with the hard-coding scan, ignore list (installed libraries, the data folder, keys), words.json and defaults.json with the content from data/README.md | stack.md · shapes.md (files) · demo-day.md (scan) | health answers; the test command reports its real test count; putting a sample course code into a code file makes the tests fail; the data folder is ignored |
| T1 | Spike SP1: read F1 with ExcelJS | stack.md (spikes) | as stack.md SP1; result written in the report |
| T2 | Spike SP2: write a merged-cell Thai grid | stack.md (spikes) | as SP2 |
| T3 | Spike SP3: Thai PDF page | stack.md (spikes) | as SP3, page-1 image looked at |
| T4 | Spike SP4: worker + cancel | stack.md (spikes) | as SP4 |
| T5 | Test sets F2-F5 (demo-day.md), each as files: source, problem.json, expected.json. F1's problem.json is written once and checked by hand against base/. Plus one hand-made VALID timetable for F2, as a result.json | demo-day.md · shapes.md | every problem.json follows shapes.md; F4 stays solvable (no new contradiction); F5 has none of F1's names |

## Stage 1: data, just enough to feed the engine
| ID | Task | Read | Done when |
|---|---|---|---|
| T6 | Input data check: every field and value in shapes.md "Input data" is validated; problems become ReviewItems | shapes.md · data/README.md | F1 and F2 valid; 10 deliberately broken inputs each produce the right ReviewItem |
| T7 | Read .xlsx into plain-text rows (merged cells, rich text joined, formulas give results, dates as text) | data/README.md (traps) · stack.md | F1 Thai and English: every cell plain text; a corrupt file → unreadable_file; an empty file → bad_input |
| T8 | Sheet type, header row, column matching (synonyms) → Match proposal | data/README.md (synonyms) · shapes.md | F1 Thai, F1 English and F4 (reversed columns) give the same field matches; an unknown header → field empty, sure no |
| T9 | Rows → Input data: text rules (room type, position, fixed slot, unavailable, category, year and groups), skipped rows with reasons, duplicate warning | data/README.md · shapes.md | F1: 6 groups, 33 courses, 5 teachers, Teacher A unavailable Wednesday 1-4; Thai + English together → duplicate warning; every skipped row has a reason |

## Stage 2: engine (the points)
| ID | Task | Read | Done when |
|---|---|---|---|
| T10 | The checker (engine section 5), sharing no code with anything else in engine/ | engine/README.md §5 · shapes.md (Report) | the F2 valid timetable passes; 12+ copies, each breaking one rule, each caught with the right rubricId |
| T11 | Input data → lessons to place (theory shared by the year's groups, practical per group, fixed, activity slot) | engine/README.md §1-2 · shapes.md | F1: 51 lessons to place; every activity course fixed at the activity slot |
| T12 | Analysis (engine 3a) | engine/README.md §3a | F1 ok with 36/37/34 periods, 159 counted, bands 138-170 (demo-day.md); F3 infeasible naming period 1 on Thursday and Friday; under 1 s |
| T13 | Day builder + phase 1 search with filters and counts (sections 1, 2, 3b) | engine/README.md §1-3b | F2 placed; the checker's time rules (H1-H6) pass on it; same input twice → same placement |
| T14 | Lookahead, MRV ordering, interchangeable classes | engine/README.md §2-3b | F1 placed within 30 s; steps reported before and after this task |
| T15 | Phase 2: rooms, then teachers; ask phase 1 for the next timetable on failure | engine/README.md §3c | F1 feasible; the checker passes every rule; every teacher inside min-max |
| T16 | Limits, statuses, likely causes, measurements | engine/README.md §3d-3e | a tiny step limit → searchLimit with "not a proof"; F3 → infeasible; stats filled |
| T17 | Improvement (section 4) | engine/README.md §4 | F1: final score ≤ first score; history per round; the checker passes after; same seed → same result |

## Stage 3: running and output
| ID | Task | Read | Done when |
|---|---|---|---|
| T18 | Runs in the worker: start, poll, cancel, timeout, saved, survive a restart | stack.md · shapes.md (Run) | health under 50 ms during a run; cancel stays cancelled; a crashing fake engine → state failed, app alive; runs still listed after restart |
| T19 | Views (group, teacher, room, course) | output/README.md · shapes.md (View) | every row covers periods 1-periodsPerDay exactly once; F1 group views add up to 36/37/34 lesson periods |
| T20 | Report, assumptions panel, run history (compare, choose) | output/README.md · shapes.md | F1 report: every item passed; a changed value appears in the assumptions; compare shows the change |
| T21 | Excel export | output/README.md · stack.md | the file reopens; sheet names valid; one known lesson cell matches the view |
| T22 | PDF export (with the choice from T3) | output/README.md · stack.md | page-1 image looked at: Thai marks in place, codes visible; its location in the report |

## Stage 4: routes and the rest of data
| ID | Task | Read | Done when |
|---|---|---|---|
| T23 | All routes in app/routes.md | app/routes.md · shapes.md | every route answers; each error code produced once in a test; a "../" id → bad_input |
| T24 | Paste, template, data guide (ladder rungs 5-6) | data/README.md (ladder) | pasted F1 rows give the same records as the upload; the template's columns = the active fields |
| T25 | Settings and AI rung 4 (optional; after spike SP5) | data/README.md (AI) · stack.md · app/screens.md (Settings) | without a key: ai_off and the ladder still works; with a key: a Thai sentence → a flagged proposal; a deliberately invalid AI answer (e.g. day 9, an unknown category) is dropped by the input check; the AI never proposes min/max hours; the key is never returned by any route and never in git |

## Stage 5: together
| ID | Task | Read | Done when |
|---|---|---|---|
| T26 | One self-check command (demo-day.md) + full run on F1-F5 | demo-day.md | F1 feasible, F2 feasible, F3 infeasible with the right cause, F4 feasible with no code change, F5 gives F1's numbers; the hard-coding scan is clean |
| T27 | Connect the partner's screens (he builds them from app/screens.md + app/routes.md) | app/ | every screen in screens.md works against the real backend |
