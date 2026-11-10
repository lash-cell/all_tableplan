# System architecture

> These pages describe the target system. The full local app workflow is not implemented in TimeTableMaker 1.0:
> persistent runs, score improvement, and the complete export pipeline remain planned.

## The four parts

```text
 TEACHER
    │
    ▼
 APP / SERVER ───── coordinates requests and stores the current problem and runs
    │
    ├──► INGEST ─── turns files, pasted rows, and form entries into confirmed input
    │                    │
    │                    ▼
    ├────────────────► ENGINE ─── Node.js analyzes/prepares → Python CP-SAT solves →
    │                                JavaScript checker validates
    │                                  │
    │                                  ▼
    └────────────────────────────── EXPORT ─── views, explains, and downloads results
```

**Target stack:** React + Vite screens; Node.js (plain JavaScript, built-in `node:http` and `node:sqlite`) for the
local app; Python 3.12.3 + OR-Tools CP-SAT 9.15.6755 only for the solver subprocess. ExcelJS reads `.xlsx` input;
ExcelJS export is planned. Optional AI (Groq first choice) proposes input interpretations only; it does not
schedule or verify.

## Choose a topic

1. [App and server](app-server.md) — screens, API routes, local server, storage, and solver process bridge.
2. [Ingest](ingest.md) — how teacher-provided data becomes a confirmed problem.
3. [Engine](engine.md) — analysis, CP-SAT constraint model, independent validation, and planned improvement.
4. [Export](export.md) — timetable views, reports, run history, Excel, and PDF.

## Shared data flow

```text
Teacher input
    │
    ▼
Confirmed problem ──► Engine ──► Checked result ──► Views and files
        │                  │              │
        └──────────────────┴──────────────┴── stored with SQLite runs (planned)
```

The shared field names are defined in [shapes.md](../../restart/shapes.md). `problem.json` and `result.json`
name the data contracts and test fixture formats; live app state and run history are planned for built-in
`node:sqlite`. SQLite persistence is not implemented in TimeTableMaker 1.0.
