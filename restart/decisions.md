# Decisions

Append-only: the owner's answers to agents' questions (how: asking.md). Read it before asking anything; never edit
an earlier line. A later answer that changes an earlier one names it.

| # | Date | Asked by | Question | Answer | Changes |
|---|---|---|---|---|---|
| 1 | 2026-11-10 | assistant | Should SQLite replace persisted problem/result/run files while their JSON shapes remain contracts, or should JSON files remain storage? | Use the option that avoids making the planned structure fail or require another replan: SQLite persists app state; JSON shapes remain the contracts and test fixtures. | `stack.md` selects built-in `node:sqlite` and forbids other databases; `shapes.md` and the data, engine, output, and presentation docs now describe SQLite persistence with unchanged JSON contracts. |
| 2 | 2026-11-10 | assistant | Should the canonical stack continue to forbid Python and use Node worker threads, or follow TimeTableMaker 1.0 by allowing Python only for OR-Tools CP-SAT through a local child process? | Allow Python 3.12 with OR-Tools CP-SAT only as the local solver backend; Node.js/JavaScript remains responsible for the app, ingest, analysis, solver bridge, and independent checker. Use a child process instead of a Node worker-thread scheduler. Keep persistent SQLite storage and improvement as planned work, not implemented features. | Replaces the one-language/worker-thread engine choice in `stack.md`; updates `engine/README.md`, `engine/techniques.md`, `tasks.md`, `shapes.md`, and the architecture presentation. |
