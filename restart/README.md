# Start here

The plan for rebuilding the timetable maker: a local web app that a teacher uses on one computer to make the
school timetable. Read this file, then tasks.md: take your task, and read only what its "Read" column lists.

## The flow

```
 1 PUT DATA IN ──► 2 CHECK ──► 3 GENERATE ──► 4 LOOK & VERIFY ──► 5 EXPORT
      data/          engine/      engine/         output/            output/
        ▲                                            │
        └──────────── edit data, run again ◄─────────┘
```

- 2 Check: "can this fit at all?", arithmetic only and fast. An impossible problem scores through this report (R 3.3).
- 3 Generate: one button gives a timetable that obeys every rule, or the reason none exists, plus how the engine
  worked and its quality score (R 4.4-4.8).

## Folders

| Folder  | Component                                     | Takes from  | Agent builds?                                              |
| ------- | --------------------------------------------- | ----------- | ---------------------------------------------------------- |
| data/   | forms, upload, column matching, data guide    | the teacher | yes                                                        |
| engine/ | check, timetable search, improvement, checker | data/       | yes                                                        |
| output/ | view grids, report, Excel and PDF             | engine/     | yes                                                        |
| app/    | the screens                                   | all three   | NO: a screen list for the partner, who builds the frontend |

Each folder's README has the same parts: what it does, Takes, Gives out, its files. "Gives out" says what passes
between folders in words; shapes.md holds the exact field names, and is the only place they are defined.

## Shared files

- tasks.md: the numbered tasks (T0-T27), in build order, each with what to read and its "done when" checks.
- asking.md: how to ask the owner · decisions.md: every answer so far (read it before asking).
- shapes.md: the exact data passed between parts. New fields are proposed there first, never invented in code.
- criteria.md: how to write the rubric file · criteria-current.md: the current rubric, ranked.
- stack.md: the stack, the forbid list, and what is "later". Read before adding any library or feature.
- demo-day.md: the test data sets F1-F5 (used by every folder's tests) and the competition checklist.
- presentation.md: the talk's order, the architecture and the algorithm in plain words (for the diagrams).
- Rule ids: G = base/guideline.pdf rule · R = rubric item. Each rule is written once; other files point to it by id.

## Build order (follows the points in criteria-current.md; the detail is tasks.md)

0. Ground: skeleton, spikes, test sets (T0-T5).
1. data/: just enough to feed the engine (T6-T9).
2. engine/: the checker first, then analysis, CP-SAT model and solver bridge, improvement (T10-T17).
3. Running and output/: solver runs, views, report, history, Excel, PDF (T18-T22).
4. Routes and the rest of data/: paste, template, guide, AI (T23-T25).
5. Together: self-check on F1-F5, the partner's screens (T26-T27). Then demo-day.md rehearsals.

## Working rules for agents

- Read this file and tasks.md, then only what your task's "Read" column lists.
- Build only in your folder's part of the code. The plan folder is read-only (except appending to decisions.md):
  propose changes in your report.
- "Done" means you ran the checks and pasted their real output. Never claim a pass you didn't run.
- Never hard-code the sample data. Data lives in files (shapes.md, "The files"), never in code. The test command's
  hard-coding scan and the renamed set F5 (demo-day.md) catch it; both must pass before anything is done.
- The same error after 3 attempts: stop, report what you tried and measured.
- Unsure what the data means: don't guess. Record an assumption or ask, the way asking.md says: one clear question
  with options, the answer read back before acting, and written into decisions.md. Read decisions.md first.
- When the sample files change, no code may need to change. If some does, it was hard-coded: that is a bug.

## Starting a session (the owner pastes this)
> You are building one part of a timetable app. The plan is in all_tableplan/restart/. Read README.md, tasks.md and
> decisions.md, then only the files your task's "Read" column lists. Your task: <T-ids>. Build only that. Ask me the
> way asking.md says when the plan doesn't answer something. End with the report described in README.md.

One to three tasks per session: short sessions keep a free model's context small.

## Report (every session ends with this)
| Part | Content |
|---|---|
| Tasks | ids, and done / not done for each |
| Changed | every file changed in the code repo |
| Checks | each "done when" check of the tasks, with its REAL output pasted (pass/fail counts as shown) |
| Assumptions | every one made, or "none" |
| Questions | open questions in the asking.md format, or "none" |
| Measured | solver status, wall time, branches/conflicts, model size, and bridge time for engine tasks; "n/a" otherwise |

## The owner's check (before accepting a session)
1. Only files of the task's folder changed (look at the changed-file list).
2. Re-run the checks named in the report: different numbers = reject.
3. The test command's hard-coding scan is clean.
4. The report's questions are answered, and the answers are in decisions.md.
5. Mark the task done in tasks.md (owner only), then commit.

## Code
- The code repo is algorithm-parts. It holds an earlier ingest port and an HTTP adapter from the OLD plan: reuse a
  part only where it matches this plan; the owner decides.
- timetable_maker_rebuild holds the OLD locked tests. They test the old rules (blocks of 2-4 periods, the 22-tool
  surface), so they don't apply to this plan as they are. New tests follow F1-F5 (demo-day.md).

## Decisions that hold everywhere

- One block per course: hours are never split (G9, R 1.7).
- Teachers need no break; the break rule is for students (G1, G2).
- Activity and scout courses go on Thursday 6-7 (G3).
- No student-facing page and no access from other devices: the tool is for teachers.

## Status

| Part               | State                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| criteria           | template + current fill done                                                                          |
| data/              | done                                                                                                  |
| engine/            | done: sections 1-5 + techniques.md                                                                    |
| output/            | done                                                                                                  |
| app/               | done: screens.md + routes.md for the partner                                                          |
| shapes.md, tasks.md | done: exact field names · T0-T27                                                                     |
| stack.md           | done: stack, forbid list, later lane                                                                  |
| demo-day.md        | done                                                                                                  |
| old plan files | deleted 2026-11-09; AGENTS.md at the top now points here |
