# Demo day

> Read when: preparing for the competition or rehearsing. Key rule: the demo itself is 10 points (R 5.1, 5.2), and
> "cannot be verified = 0" applies on stage, so every rule must be shown, not claimed.

## Test data sets (also used by the tests in every folder)
| Set | Content | Proves |
|---|---|---|
| F1 sample | the files in base/ | the main case works |
| F2 tiny | 1 year, 1 group, 2 teachers, a few courses | fast debugging; agents use it first |
| F3 impossible | F1 with a deliberate contradiction (e.g. two courses fixed in the same slot for one group) | the cause report is clear (R 3.3) |
| F4 changed | F1 with what judges might change: a teacher added, a course changed, a new fixed slot, columns reordered | nothing is hard-coded |
| F5 renamed | F1 with EVERY code, course name, teacher name, group name and sheet name replaced by made-up ones | the same numbers as F1: code that only works because it knows the sample's names fails here |

Each set is kept as files: the source (.xlsx where there is one), its problem.json, and an expected.json with the
numbers it must give. Engine and output tests use only the problem.json files.

Hard-coding scan (part of the test command): every code, name, group and sheet name found in F1 is searched for in
the code. Any hit fails the tests. Test files and the test sets themselves are excluded from the scan.

Expected on F1 (the current sample only; recompute when base/ changes; numbers from the old plan's checks):
- 6 groups (3 years × 2) · 5 teachers, Teacher A unavailable Wednesday 1-4 · 33 course records, 5 teacher records.
- periods per group: Year 1: 36 of 40 possible · Year 2: 37 · Year 3: 34.
- teacher periods counted: 159 (activities counted, general education not) · general education: 21 periods ·
  workload bands sum to 138-170.
- period 1 is tight: on Thursday and Friday 6 lessons need a teacher at period 1 but only 5 teachers exist, so one
  year must open with a shared theory lesson on each of those days. An engine that ignores this fails on F1.
- F3 can be made by removing those two shared theory courses (21909-1011, 21909-2022): the analysis must answer
  "infeasible", naming period 1 on Thursday and Friday.

## Before the day
- [ ] One command starts the app; a self-check runs: app up → load F1 → check → generate → checker passes.
- [ ] Everything installed and downloaded ahead of time. Test with the network OFF.
- [ ] A copy of the whole project, installers and the test sets on a USB stick.
- [ ] A saved good run of F1, clearly labelled "saved result", in case the engine fails on stage.
- [ ] The Excel and PDF opened on ANOTHER computer: Thai text and course codes both visible.
- [ ] F3 and F4 rehearsed: what to say when the timetable can't be made.
- [ ] A timed drill on a file the readers can't handle: paste it (data/ ladder rung 5), then by template (rung 6).
      Know how long each takes.
- [ ] Two full timed rehearsals: explanation (R 5.1) then live demo (R 5.2).

## On the day
1. Start the app, run the self-check (under 10 minutes).
2. Load the judges' file. Read EVERY "needs review" item; enter their custom requirements through the form.
3. Check ("can this fit?"), then Generate.
4. Show the report: every rubric item passed, the teacher loads, the assumptions panel. Press "Check again".
5. If no timetable exists: show the causes. That earns R 3.3; it is not a failure.
6. Export Excel and PDF straight away, every time a good result appears.
7. No code changes once judging starts.

## The explanation
The talk, its order and its diagrams are in presentation.md.
