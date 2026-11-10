# System architecture

> These pages explain the planned system. The application is not implemented in this repository yet.

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

SQLite storage supports the app and server. Optional AI is a helper inside ingest only.

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
        └──────────────────┴──────────────┴── stored with SQLite runs
```

The shared field names are defined in [shapes.md](../../restart/shapes.md). `problem.json` and `result.json`
name the data contracts and test fixture formats; live app state is planned to be stored in SQLite.
