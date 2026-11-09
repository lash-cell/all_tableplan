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
In one line: the screens send the teacher's data to one local program, which turns it into one file, schedules it,
checks it, and sends back timetables and files. Everything runs on this computer.

| Part | What it does | Built with | Why |
|---|---|---|---|
| Screens | what the teacher sees: Data, Generate, Results | React + Vite | a normal web page; nothing to install but the program |
| Local server | the one program; passes requests to the parts | Node.js, its built-in web server, 127.0.0.1 only | one language for everything; nobody outside this computer can reach it |
| Data step | reads uploads, pasted rows and forms into one clean file | ExcelJS · word lists in words.json · guideline values in defaults.json | a new synonym or rule value is a file edit, never a code change |
| problem.json | the one input format | plain JSON | the engine never sees a spreadsheet, so it can't hard-code one |
| Engine | check, build, assign, check again, improve | plain JavaScript, in a background worker | the screen stays responsive, and a run can be cancelled |
| result.json | the one output format | plain JSON | every view and export comes from the same checked result |
| Output | timetable grids, report, Excel, PDF | ExcelJS · a PDF library with a Thai+Latin font | what's on screen and in the files always matches |
| Storage | saved data and every run | JSON files in one folder | one user, small data: no database needed |
| AI assistant (optional) | proposes values for unreadable parts | a free API (Groq), with the user's own key | helps with messy input; the app works fully without it |

If a spike (stack.md) changes a first choice, change the "Built with" column here too.

## 4. The algorithm
### Diagram 1: the whole process
| Phase | Step | What happens | Why |
|---|---|---|---|
| Plan | 1 Check | Counts whether the hours, teachers and rooms can fit at all, before any search. | If it can't fit, we explain why at once instead of searching forever. |
| Act | 2 Fixed first | Puts the lessons that have only one possible place (activity Thu 6-7, fixed slots) on the grid first. | The hardest-to-place go first (MRV), so nothing else takes their teacher or room. |
| Act | 3 Build days | Fills each group's day from period 1 to the end: a lesson, the break, or end the day. On a dead end, it undoes the last choice. | The day rules (start at 1, one break, no gaps) can never break, because the moves are built that way. |
| Act | 4 Who and where | Gives each lesson a teacher and a room. If that fails, it asks step 3 for the next timetable. | Deciding time first, then people, keeps both searches small. |
| Check | 5 Checker | A separate program re-checks every rule on the finished timetable. | The builder can't vouch for itself; a shared bug would hide in both. |
| Evaluate | 6 Improve | Scores the timetable (teacher gaps, late finishes, fair loads) and swaps lessons, keeping the better ones. | A valid timetable becomes a good one, and the falling score is the proof. |

### Diagram 2: inside step 3
| Idea | In words |
|---|---|
| Three moves | At each period a group can start a lesson, take its break (only in periods 4-6), or end its day. |
| Earliest group first | The builder always works on the group that is furthest behind, so groups sharing a theory lesson reach the same period together. |
| Looking ahead | Before each new day it asks "can period 1 still be staffed on the days left?" In the sample, Thursday needs 6 teachers at period 1 but there are 5, so one year must start with a shared lesson; the builder knows this early instead of failing days later. |

Source of truth for these words: engine/README.md. If the engine changes, change this section with it.
