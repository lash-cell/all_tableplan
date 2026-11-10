# Engine: from problem to verified timetable

## What this part does

The engine analyzes the confirmed problem in JavaScript, sends the scheduling model to a local Python process
running OR-Tools CP-SAT, and checks the returned candidate with a separate JavaScript checker. The separate
improvement stage remains planned; it is not in TimeTableMaker 1.0.

## Input boundary: ingest vs. engine

Ingest normalizes **source data**: workbook cells, headers, pasted text, and teacher entries become a confirmed
object matching the problem JSON contract. The engine accepts that object; it does not read spreadsheets or
reinterpret source text.

The engine still prepares its own **internal scheduling model** from the accepted object. For example, it expands
the course records into lesson blocks, shares theory lessons across a year's groups, and creates practical lessons
per group. Node.js checks the input shape and values; Python then builds CP-SAT candidates and constraints. This
is solver preprocessing, not a second ingest pipeline.

## Engine process schema

```text
CONFIRMED PROBLEM JSON SHAPE
       │
       ▼
NODE.JS: CHECK INPUT, ANALYZE, PREPARE LESSONS
       │
       ▼
PYTHON SUBPROCESS: OR-TOOLS CP-SAT
JSON over stdin/stdout; build one joint constraint model
       │
       ├── time limit without solution ──► SEARCH LIMIT
       ▼
candidate with day/start/teacher/room choices
       │
       ▼
JAVASCRIPT INDEPENDENT CHECKER
       ├── violations ──► ENGINE DEFECT; do not show as success
       ▼ all hard rules pass
FEASIBLE RESULT
       │
       ▼
FUTURE: IMPROVEMENT STAGE, THEN CHECK AGAIN
```

## Stages in plain language

### A. Validate and analyze in Node.js

The Node.js side accepts only the confirmed problem data shape, checks its fields, creates internal lesson data,
and runs fast necessary arithmetic checks. A proven contradiction returns **infeasible** with causes. Passing
means only **not ruled out**; it does not guarantee a timetable.

### B. Prepare lessons

Turn course records into lessons. A theory lesson is shared by the groups in that year. A practical lesson is
made separately for each group. Each course stays one consecutive block.

### C. Build the CP-SAT model in Python

Node launches the local Python solver with the problem and time limit as JSON. The solver creates candidate
assignments for each lesson and models day shapes, fixed times, group coverage, teacher and room non-overlap,
availability, room types, and workload. Fixed lessons have only their required time candidates.

Unlike the earlier two-phase search design, CP-SAT considers time, teacher, and room assignments together in one
model, alongside each group's allowed day shape. It uses one search worker and a fixed seed for repeatability.

### D. Return honest solver outcomes

The solver can return a feasible solution, prove infeasibility, or stop without a solution at its time limit. A
time-limit result must map to **searchLimit**, not **infeasible**. Invalid solver output or process failure is an
error, not a timetable.

### E. Independently check

The checker is implemented separately from the search. It recomputes every hard rule, so a bug in the builder is
less likely to hide in its own validation. A failed check means an engine defect; never call that proof that the
teacher's input is impossible.

The checker is also a **development test oracle**: test a valid timetable, break one rule at a time, and ensure the
correct violation and rule ID are detected.

### F. Future work: improve after validity

The planned improvement stage may lower soft penalties, such as teacher idle time, late finishes, and uneven
teacher loads. It is not implemented in TimeTableMaker 1.0. When added, it must preserve hard rules and run the
independent checker again before returning the final result.

## Possible outcomes

| Outcome | Meaning |
|---|---|
| `feasible` | A timetable passed the independent checker |
| `infeasible` | Analysis or a complete search proved no timetable exists |
| `searchLimit` | Search stopped at a limit; this is not proof of impossibility |
| `invalidInput` | Input data could not be used |
| `validationFailed` | The engine produced a candidate that failed the checker; this is a system defect |

**Technology:** Node.js/JavaScript for input checks, analysis, lesson preparation, subprocess bridge, and checker;
Python 3.12.3 with OR-Tools CP-SAT 9.15.6755 for the solver only. CP-SAT jointly searches for a feasible schedule;
score-based improvement and score history are planned, not part of the current integration. Full rules and model details:
[engine/README.md](../../restart/engine/README.md). Shared input/output fields:
[shapes.md](../../restart/shapes.md).

The solver time-limit status in TimeTableMaker 1.0 is currently named `timeout`; the Node adapter still needs to
translate it to the shared contract's `searchLimit`.
