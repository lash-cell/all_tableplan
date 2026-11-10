# Decisions

Append-only: the owner's answers to agents' questions (how: asking.md). Read it before asking anything; never edit
an earlier line. A later answer that changes an earlier one names it.

| # | Date | Asked by | Question | Answer | Changes |
|---|---|---|---|---|---|
| 1 | 2026-11-10 | assistant | Should SQLite replace persisted problem/result/run files while their JSON shapes remain contracts, or should JSON files remain storage? | Use the option that avoids making the planned structure fail or require another replan: SQLite persists app state; JSON shapes remain the contracts and test fixtures. | `stack.md` selects built-in `node:sqlite` and forbids other databases; `shapes.md` and the data, engine, output, and presentation docs now describe SQLite persistence with unchanged JSON contracts. |
