# Output: views, report, export

> Read when: building timetable views, the check report or Excel/PDF export. Key decision: every view and export
> comes from the one stored engine result, so they can never disagree.

Steps 4 and 5 of the flow (README.md). This folder makes the DATA for each view (ready-to-draw grids). Drawing them on
screen is the app's job (app/README.md).

| Takes | Gives out |
|---|---|
| result.json and the run's copy of problem.json (shapes.md) | View (shapes.md) · the report · the assumptions panel · run history · an .xlsx file · a .pdf file |

## Views (G 2a-2d, R 2.2-2.4, 3.4)
| View | One grid per | Shows in each lesson cell |
|---|---|---|
| Group | student group (this is the students' timetable, G 2d) | course, teacher, room |
| Teacher | teacher (general education has none, so it never appears here) | course, groups, room |
| Room | room | course, groups, teacher |
| Course | (a list, not a grid) every lesson, sorted by course code | day, periods, groups, teacher, room |

### Gives out: a view
```
 view
  ├─ kind ──── group · teacher · room · course
  ├─ keys ──── every group / teacher / room in the timetable, sorted (the picker's list)
  ├─ key ───── the one shown (default: the first)
  └─ rows ──── one per school day, in order
       └─ cells, covering periods 1 to the last period of the day exactly once, in order:
            ├─ lesson ── start, end (one cell spans its block), course code, course name, groups, teacher, room
            ├─ break ─── group view only
            └─ free
 course view: no rows; a list of every lesson, sorted by course code, then groups
```
Days and periods come from the input data (Time and limits), never fixed in the view code.

## Check report (R 3.3, "cannot be verified = 0")
The engine's Report (shapes.md), shown per RUBRIC ITEM (1.1-1.12, 2.1): passed · failed with its violations (who,
what, when) · not applied. Plus the teacher loads (R 2.3). When no timetable exists: the causes and likely causes in
plain sentences. Plus the score history (R 4.8), as a table the app can draw as a graph.

## Assumptions panel (R 4.6, and fair partial marks)
One list the judges can read: how the system read every unclear point.
- every value in Time and limits that differs from the guideline, with both values;
- every value the teacher accepted from the AI assistant (source `how: "ai"`), with the original text;
- every assumption the engine recorded, including its fixed decisions (e.g. "1 hour = 1 period", "the break is
  chosen per group and per day").

Why: when a judge reads a rule differently, a visible, stated assumption earns partial marks; a hidden one earns 0.

## Run history (R 4.7, 4.8)
Every "generate" is kept as a run: the time, a copy of the input data used, the status, the check summary and the
score.
- Two runs can be compared side by side: what changed in the data, score per term, rules passed.
- The teacher marks one run as "chosen". Views and exports use the chosen run.
- A run that isn't feasible is kept too (its report is the evidence for R 3.3).

## Export (G 2e, R 3.5)
- Only the chosen run, and only when it is feasible (not_feasible otherwise).
- Excel: one sheet per group, teacher and room, plus an "all lessons" sheet (one row per lesson: day, periods, code,
  name, groups, teacher, room). Built from the same grids as the views. A lesson cell is merged across its periods
  and reads "code name / teacher / room" (no teacher for general education); break cells read "พัก".
  Sheet names can't contain / \ ? * [ ] : and every group id has a "/": replace it ("ทค.1/1" → "ทค.1-1"), keep
  names to 31 characters and unique.
- PDF: one landscape page per group (teacher and room pages optional). Thai and Latin letters must both show, so
  the font needs both scripts.
