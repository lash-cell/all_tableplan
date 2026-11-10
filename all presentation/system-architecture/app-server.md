# App and server

## What this part does

The app is the teacher-facing control panel. The server receives its requests, calls the right subsystem, stores
state, and returns results. The planned program runs on one computer and listens only on `127.0.0.1`.

## Request path

```text
Teacher
  │ uses a screen
  ▼
React + Vite screens
  │ HTTP request under /api
  ▼
Node.js local server
  ├──► Ingest: read, match, validate, confirm data
  ├──► Engine worker: check or generate a timetable
  ├──► Output: prepare views and reports
  └──► SQLite: load or save the current problem and runs
        │
        ▼
      Response to screen: JSON, progress, or downloaded file
```

## Main screens

| Screen | Teacher does | Server work |
|---|---|---|
| Data | Enter, upload, paste, review, and confirm data | Ingest and save the problem |
| Generate | Check feasibility, start or cancel generation | Analyze or manage a worker run |
| Results | View timetables, reports, history, and exports | Load the selected run and prepare output |
| Settings | Configure optional AI provider and key | Save settings locally; never return the key |

The screens show results; they do not implement scheduling rules. Rule outcomes come from the engine's checker.

## What the server does

1. Receives an `/api` request from the local screens.
2. Checks the request and validates IDs before using them.
3. Routes the request to ingest, engine, or output logic; routes are translators, not the home of business rules.
4. Reads or writes the current problem and run history in SQLite.
5. Returns a structured response or a file download.

## Generation is a background job

```text
POST /api/runs
      │
      ├── save run as "running"
      └── start worker ──► engine
                              │ progress / result / error / exit
GET /api/runs/{id} ◄─────────┘
      │
      ├── still running: show progress; poll again
      ├── finished: show result
      └── cancel request: stop worker and mark cancelled
```

The worker keeps long searches from blocking the server. The server can continue answering requests and can
cancel a run.

## Storage and boundaries

- Built-in `node:sqlite` is the planned local storage.
- Store the current problem and each run, including that run's input copy and result.
- Editing current data must not rewrite earlier runs.
- The database and user's AI key belong in the ignored local data folder, not in source control.
- Errors use a consistent API shape with a safe message; internal details are not sent to the teacher.

The planned stack is Node.js, its built-in HTTP server, worker threads, and `node:sqlite`. Exact SQL tables and
migrations are not yet designed. See [routes.md](../../restart/app/routes.md) and
[stack.md](../../restart/stack.md).
