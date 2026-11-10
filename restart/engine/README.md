# Engine: analyze, solve, and independently check

> Read when: building or fixing the engine. The selected solver is OR-Tools CP-SAT in a local Python subprocess.
> Node.js/JavaScript owns input checks, analysis, lesson preparation, the process bridge, and the independent checker.

The engine accepts only the confirmed problem object in [shapes.md](../shapes.md). It never reads a spreadsheet,
sheet name, or source column. Ingest normalizes source material; the engine checks the contract and prepares the
solver model.

| Takes | Gives out |
|---|---|
| confirmed problem object (shapes.md) | result object (shapes.md): status, lessons, report, causes, and solver measurements |

## Process overview

```text
Confirmed problem object
          │
          ▼
Node.js: validate input, run quick analysis, check lesson expansion
          │ impossible / invalid ──► return explanation; no solver process
          ▼
Node.js sends problem JSON and time limit to local Python child process
          │ stdin
          ▼
Python builds one OR-Tools CP-SAT model and solves it
          │ stdout: JSON result; stderr: diagnostics only
          ▼
Node.js parses result and maps solver status to the API contract
          │ feasible candidate
          ▼
Independent JavaScript checker recomputes every hard rule
          │
          ├── violation ──► engine defect; do not report success
          └── all pass ───► return feasible timetable and report
```

The child process is launched locally with Node's `child_process`; no solver service or network connection is
used. JSON is the process boundary. The Node bridge must handle spawn errors, non-zero exits, malformed JSON,
stderr, output-size limits, time limits, and cancellation without crashing the HTTP server.

## 1. Prepare solver lessons

The engine transforms the confirmed input object into internal lesson tasks:

- A theory course becomes one shared lesson for every group in its year.
- A practical course becomes one lesson per group.
- Each course remains one consecutive block of its full period count.
- Fixed course times are retained; activity courses use the configured activity slot.
- A missing year/group match or conflicting fixed slot is reported before solving.

This is engine preprocessing, not ingest: the input is already normalized to the shared contract.

## 2. CP-SAT model

Python constructs candidate assignments for each lesson. A candidate includes its day, starting period, teacher,
and room (where those resources apply). Fixed times, finish limits, room types, and unavailability restrict which
candidates may be created.

The model chooses one candidate for each lesson and encodes the hard rules together:

| Model rule | How it is represented |
|---|---|
| Group day shape | Choose one allowed day pattern per group and day: start at period 1, exactly one configured break, no other gaps, and finish by that year's limit |
| Group coverage | Every occupied period in the selected day pattern has exactly one lesson; break periods remain unoccupied |
| Course coverage | Every required course lesson is selected once, with its full consecutive duration |
| Theory and practical | Shared theory task uses all groups of the year; practical task uses one group |
| Fixed and activity times | Candidate starts are restricted to the required day and periods |
| Teacher assignment | General education uses no department teacher; other lessons get an eligible teacher, respecting given assignments |
| Teacher conflicts and availability | A teacher is assigned to at most one lesson per period and never during unavailable periods |
| Teacher workload | When enabled, each teacher's total is within min/max |
| Room type, conflict, and availability | Candidates use a compatible room; a room is assigned to at most one lesson per period and is not used while unavailable |

Time, teacher, and room assignments are solved jointly. This replaces the earlier two-phase design that searched
for times first and assigned resources afterwards.

## 3. Fast feasibility analysis

Before starting CP-SAT, JavaScript runs necessary arithmetic checks, cheapest first:

| Layer | Checks | Example cause |
|---|---|---|
| 1: sizes | a lesson fits a possible day shape; each group can fit its required weekly periods | "This course needs 8 periods; the longest possible block is 7." |
| 2: fixed lessons | fixed lesson clashes, day shape, teacher or room capacity at a fixed time | "Two fixed lessons overlap for this group." |
| 3: resources | teacher totals within min/max, teacher availability and period-one staffing, weekly room capacity | "Teachers need 180 periods; their maximums allow 170." |

If a necessary check proves a contradiction, return `infeasible` with causes. If every check passes, return `ok` and
continue: passing does not prove a timetable exists. F1 analysis should take under one second; F3 should identify
the Thursday and Friday period-one staffing shortage.

## 4. Solver bridge, limits, and honest statuses

Node sends the confirmed problem and time limit to the Python process as JSON. Python returns a JSON object; error
diagnostics go to stderr, not into the result stream. CP-SAT runs with one search worker and a fixed seed so repeated
inputs are reproducible.

| CP-SAT outcome | Engine/API meaning |
|---|---|
| `OPTIMAL` or `FEASIBLE` | Candidate found; run the independent checker before returning `feasible` |
| `INFEASIBLE` | Solver proved that no candidate satisfies the modeled rules; return `infeasible` |
| `UNKNOWN` at time limit | No proof and no solution in time; return `searchLimit`, never `infeasible` |
| `MODEL_INVALID`, malformed output, or process failure | Explicit internal/model error; never present a timetable |

The Python integration in TimeTableMaker 1.0 currently labels its time-limit outcome `timeout`; the Node adapter
must map that to the contract's `searchLimit`. Do not leak solver-specific status names as a substitute for the
shared result status.

Record useful measurements from CP-SAT: solver status, wall time, branches, conflicts, variable count, and
constraint count, plus the total Node-to-result elapsed time. The API shape for these measurements is in
[shapes.md](../shapes.md).

When a bounded solve finds no timetable, the planned diagnosis can rerun the model with one optional rule group
disabled at a time. If removing a group allows a solution, report it as a likely cause or suspect, not as proof.
The main CP-SAT result status remains the result of the original, unchanged problem.

## 5. Improvement: planned, not in TimeTableMaker 1.0

Improvement starts only from a checker-valid timetable. Its future job is to lower soft penalties such as teacher
idle periods, late group finishes, and uneven teacher workloads without breaking hard rules. It must record score
history, use a fixed seed, and run the independent checker again before returning the final result.

The current CP-SAT integration finds a feasible schedule but does not yet implement this improvement stage or
score history. Do not describe those features as implemented until their tests pass.

## 6. Independent checker and teacher report

The checker is JavaScript and shares no rule-checking code with the Python solver or its model. It receives the
original problem and candidate lessons, then independently checks:

- group day shape, breaks, gaps, finish limits, and daily coverage;
- one full block per course and correct theory/practical grouping;
- fixed and activity slots;
- group, teacher, and room conflicts;
- teacher/room availability, room types, and teacher workload.

Each violation identifies the rule, who is affected, and when. A failed check after a solver candidate is an engine
defect, not proof that the input is impossible; never show that candidate as a successful timetable.

The checker is also a development test oracle: start with a valid timetable, break one rule at a time, and ensure
the expected violation and rubric ID are reported. This test suite is independent of the CP-SAT model.

The report contains each rubric result (passed, failed with violations, or not applied), teacher loads, causes when
no timetable is found, assumptions, and solver measurements. The teacher gets explanations, not just a pass/fail
label. The checker may be run again on request.

## 7. Build order and verification

1. Keep input analysis and lesson preparation in JavaScript; check the shared contract.
2. Maintain the independent checker and its one-rule-at-a-time tests.
3. Build and test the CP-SAT subprocess model against F2, then F1-F5.
4. Verify status mapping, process failures, time limit, cancellation, and responsiveness.
5. Add improvement only after a checked feasible result is available.

Tests use the F1-F5 fixtures in `demo-day.md`. Do not mark an owner-controlled task complete here; report real test
output and let the owner update the checkmark in `tasks.md`.
