# App and server

## What this part does

The target app is the teacher-facing control panel. The server receives its requests, calls the right subsystem,
stores state, and returns results. The planned program runs on one computer and listens only on `127.0.0.1`.

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
  ├──► Engine bridge: check or launch the Python CP-SAT child process
  ├──► Output: prepare views and reports
  └──► node:sqlite (planned): load or save the current problem and runs
        │
        ▼
      Response to screen: JSON, progress, or downloaded file
```

## Main screens

| Screen | Teacher does | Server work |
|---|---|---|
| Data | Enter, upload, paste, review, and confirm data | Ingest and save the problem |
| Check | Ask whether the problem can fit before generation | Run fast necessary arithmetic checks |
| Generate | Start or cancel timetable generation | Manage a solver process run |
| Results | View timetables, reports, history, and exports | Load the selected run and prepare output |
| Settings | Configure optional AI provider and key | Save settings locally; never return the key |

The screens show results; they do not implement scheduling rules. Rule outcomes come from the engine's checker.

## What the server does

1. Receives an `/api` request from the local screens.
2. Checks the request and validates IDs before using them.
3. Routes the request to ingest, engine, or output logic; routes are translators, not the home of business rules.
4. Reads or writes the current problem and run history in SQLite (planned; not implemented in TimeTableMaker 1.0).
5. Returns a structured response or a file download.

## Solver runs in a local child process

```text
Node.js validates and prepares the request
      │
      ├── analyze input and build lesson data in JavaScript
      └── spawn local Python process ──► OR-Tools CP-SAT
                 │ JSON request on stdin
                 │ JSON result on stdout; diagnostics on stderr
                 ▼
          Node.js parses result and runs independent JavaScript checker
```

Node's child-process I/O is asynchronous, so CP-SAT does not block the server event loop. The target design must
handle process errors, non-zero exit, malformed output, time limits, output size, and cancellation.
TimeTableMaker 1.0 has a local subprocess bridge and solver time limit; run-history, polling, cancellation, and
persistent-run workflows remain planned work.

## Storage and boundaries

- Built-in `node:sqlite` is the planned local storage; persistence is not implemented in TimeTableMaker 1.0.
- Store the current problem and each run, including that run's input copy and result.
- Editing current data must not rewrite earlier runs.
- The database and user's AI key belong in the ignored local data folder, not in source control. The optional AI
  feature is off by default and only proposes interpretations during ingest; the teacher must approve proposals.
- Errors use a consistent API shape with a safe message; internal details are not sent to the teacher.

The target stack is Node.js (current LTS, plain JavaScript, built-in `node:http` and `node:sqlite`) with Python
3.12.3 + OR-Tools CP-SAT 9.15.6755 only as the local solver subprocess. Exact SQL tables and migrations are not yet
designed. See [routes.md](../../restart/app/routes.md) and [stack.md](../../restart/stack.md).
