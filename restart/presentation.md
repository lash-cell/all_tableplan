# Presentation

> Read when: preparing the talk or its diagrams. Key rule: the live demo is worth the most (R 5.2: 6 points), so it
> comes second, while attention is highest; everything after it explains what the judges just saw.

## Order
| # | Part | Rubric | Time (of ~12 min) | Status |
|---|---|---|---|---|
| 1 | The problem | 5.1 | 1 min | to write |
| 2 | Live demo | 5.2, 3.x | 4 min | to write (click-by-click script) |
| 3 | System architecture + stack | 5.1 | 1 min | written below |
| 4 | The algorithm: Plan → Act → Evaluate | 4.3-4.8 | 3 min | written below |
| 5 | Why this method | 4.1, 4.2 | 1 min | to write (from engine/techniques.md) |
| 6 | When it can't be done | 3.3 | 1 min | to write |
| 7 | AI in the system | 4.9 | 0.5 min | to write |
| 8 | AI in development | 4.10 | 0.5 min | to write |

The times assume a ~12 minute slot; scale them when the real slot is known.

## 3. System architecture + stack
Target flow: the screens send the teacher's data to one local program, which turns it into the problem data shape,
saves it in SQLite, schedules it, checks it, and sends back timetables and files. Everything runs on this computer.
TimeTableMaker 1.0 has the Node.js app, CP-SAT solver bridge, and independent checker; persistent SQLite runs,
score improvement, and the complete export pipeline are still planned.

| Part | What it does | Built with | Why |
|---|---|---|---|
| Screens | what the teacher sees: Data, Generate, Results | React + Vite | a normal web page; nothing to install but the program |
| Local server | the one program; passes requests to the parts | Node.js, its built-in web server, 127.0.0.1 only | local-only access; keeps the app, routes, ingest, and checker in JavaScript |
| Data step | reads uploads, pasted rows and forms into one clean problem object | Node.js · ExcelJS · words.json · defaults.json | a new synonym or rule value is a file edit, never a code change |
| problem.json | the one input contract | plain JSON shape; planned SQLite persistence | the engine never sees a spreadsheet, so it can't hard-code one |
| Engine | analyze and prepare input in JavaScript; solve constraints in OR-Tools CP-SAT; validate with the independent JavaScript checker | Node.js launches a local Python 3.12 / OR-Tools 9.15 subprocess | the constraint solver handles the measured search workload; Python is limited to the solver |
| result.json | the one output contract | plain JSON shape; planned persistence with each run in SQLite | every view and export comes from the same checked result |
| Output | timetable grids, report, Excel, PDF | planned ExcelJS export · a PDF library with a Thai+Latin font | what's on screen and in the files always matches; ExcelJS currently reads `.xlsx` input |
| Storage | planned current problem and run history | built-in `node:sqlite`, one database in the ignored data folder | local structured storage with no external database package; persistence is not implemented in TimeTableMaker 1.0 yet |
| AI assistant (optional) | proposes values for unreadable parts | a free API (Groq), with the user's own key | helps with messy input; the app works fully without it |

If a spike (stack.md) changes a first choice, change the "Built with" column here too.

## 4. The algorithm
### Diagram 1: the whole process
| Phase | Step | What happens | Why |
|---|---|---|---|
| Plan | 1 Check | Counts whether the hours, teachers and rooms can fit at all, before any search. | If it can't fit, we explain why at once instead of searching forever. |
| Act | 2 CP-SAT model | Creates candidate lesson placements and encodes day shape, fixed times, teacher and room assignments, availability, and workload as constraints. | The solver searches the choices together rather than using a separate time-first and resource-assignment phase. |
| Check | 3 Independent checker | A separate JavaScript program re-checks every hard rule on the solver's result. | The solver cannot vouch for itself; a shared bug would hide in both. |
| Evaluate | 4 Improve | A later stage may score and improve a verified timetable. | Improvement and score history remain planned work; they are not in TimeTableMaker 1.0 yet. |

### Diagram 2: inside the CP-SAT model
| Idea | In words |
|---|---|
| Candidate | Each lesson has possible day/start, teacher, and room assignments; fixed lessons have only their required time. |
| Day shape | Boolean choices select a group's day length and one allowed break; lesson placements must cover occupied periods without gaps. |
| Resource rules | Constraints prevent group, teacher, or room clashes and enforce availability, room type, and teacher workload. |
| Search limit | CP-SAT runs with a time limit. No solution before the limit is `searchLimit`, not proof of infeasibility. |

Source of truth for the selected solver and model: engine/README.md and engine/techniques.md. Improvement is still
future work; update this section when it is implemented.
