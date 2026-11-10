# Engine: from problem to verified timetable

## What this part does

The engine analyzes the confirmed problem, searches for timetable times, assigns rooms and teachers, checks the
candidate with a separate checker, and improves a valid timetable without breaking hard rules.

## Input boundary: ingest vs. engine

Ingest normalizes **source data**: workbook cells, headers, pasted text, and teacher entries become a confirmed
object matching the problem JSON contract. The engine accepts that object; it does not read spreadsheets or
reinterpret source text.

The engine still prepares its own **internal scheduling model** from the accepted object. For example, it expands
the course records into lesson blocks, shares theory lessons across a year's groups, creates practical lessons
per group, and prepares search state. This is solver preprocessing, not a second ingest pipeline. The engine also
checks that its input has the required shape and values before using it.

## Engine process schema

```text
CONFIRMED PROBLEM JSON SHAPE
       │
       ▼
CHECK INPUT SHAPE AND VALUES
       │
       ▼
┌───────────────────────────────┐
│ A. ANALYZE                    │
│ Quick arithmetic checks       │
│ impossible? → explain causes  │
└──────────────┬────────────────┘
               │ looks possible
               ▼
┌───────────────────────────────┐
│ B. PREPARE INTERNAL LESSONS   │
│ theory: shared by year groups │
│ practical: one per group      │
└──────────────┬────────────────┘
               ▼
┌───────────────────────────────┐
│ C. PLACE FIXED LESSONS        │
│ reserve required time slots   │
└──────────────┬────────────────┘
               ▼
┌───────────────────────────────┐
│ D. SEARCH FOR WHEN            │◄──────────────┐
│ build group days from period 1│               │
│ lessons / break / end day     │               │
│ filter choices, look ahead    │               │
│ dead end? undo and try next   │               │
└──────────────┬────────────────┘               │
               │ candidate times                │
               ▼                                │
┌───────────────────────────────┐                │
│ E. ASSIGN WHERE, THEN WHO     │                │
│ choose rooms, then teachers   │                │
└──────────────┬────────────────┘                │
               │ assignment fails                │
               └── ask D for another candidate ──┘
               │ assignment succeeds
               ▼
┌───────────────────────────────┐
│ F. INDEPENDENT CHECKER        │
│ recompute every hard rule     │
└───────┬─────────────────┬─────┘
        │ all pass        │ violation
        ▼                 ▼
┌─────────────────┐   ENGINE DEFECT
│ G. IMPROVE       │   do not report success
│ lower soft score │
│ keep hard rules  │
└────────┬────────┘
         ▼
┌───────────────────────────────┐
│ H. CHECK AGAIN                │
└───────┬─────────────────┬─────┘
        │ all pass        │ violation
        ▼                 ▼
   FEASIBLE RESULT     ENGINE DEFECT
   save result         do not show timetable
```

## Stages in plain language

### A. Analyze before searching

Do fast necessary checks: can lesson lengths fit a day, can groups fit their weekly periods, do fixed lessons clash,
and are teacher and room totals sufficient? A proven contradiction returns **infeasible** with causes. Passing
means only **not ruled out**; it does not guarantee a timetable.

### B. Make lesson blocks

Turn course records into lessons. A theory lesson is shared by the groups in that year. A practical lesson is
made separately for each group. Each course stays one consecutive block.

### C. Reserve fixed lessons

Place lessons with a required day and time before flexible lessons. If fixed lessons overlap or make a valid day
shape impossible, stop and report why.

### D. Search for times

Build group days from period 1 onward. At each step the search may place a lesson, take the break, or end the day.
It chooses constrained lessons early, checks whether choices can still work, and backtracks when they cannot.

The search builds a candidate; it does not decide the candidate is valid. It stops at configured limits and reports
**search limit** honestly when it has not proved infeasibility.

### E. Assign rooms, then teachers

Once lesson times are chosen, assign available compatible rooms, then available teachers. If either assignment
fails, return to the time search and ask for another candidate timetable.

### F and H. Independently check

The checker is implemented separately from the search. It recomputes every hard rule, so a bug in the builder is
less likely to hide in its own validation. A failed check means an engine defect; never call that proof that the
teacher's input is impossible.

The checker is also a **development test oracle**: test a valid timetable, break one rule at a time, and ensure the
correct violation and rule ID are detected.

### G. Improve only after validity

Start from a checked timetable. Try changes that lower soft penalties, such as teacher idle time, late finishes,
and uneven teacher loads. Keep only changes that preserve hard rules. A fixed seed makes the process repeatable.
Run the independent checker again before returning the final result.

## Possible outcomes

| Outcome | Meaning |
|---|---|
| `feasible` | A timetable passed the independent checker |
| `infeasible` | Analysis or a complete search proved no timetable exists |
| `searchLimit` | Search stopped at a limit; this is not proof of impossibility |
| `invalidInput` | Input data could not be used |
| `validationFailed` | The engine produced a candidate that failed the checker; this is a system defect |

**Planned technology:** Plain JavaScript in a Node worker thread. Full rules and search details:
[engine/README.md](../../restart/engine/README.md). Shared input/output fields:
[shapes.md](../../restart/shapes.md).
