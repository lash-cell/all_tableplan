# Screens (for the partner)

What each page must show and do, as plain controls. Layout, style and wording are the partner's choice.
Field names point to shapes.md. All text the teacher reads is Thai. Routes: routes.md.

## The page map
Three main pages in the menu, plus Settings in a corner. Each page shows its KEY FEATURE first; everything else sits
behind a tab or opens as a panel, so a page stays short and needs little scrolling.

```
 DATA ──────────── key feature: the data tables
  ├─ bar:    Upload · Paste · Template · Data guide
  ├─ tabs:   Groups · Courses · Teachers · Rooms (on/off) · Time and limits
  ├─ panel:  Column matching ─── opens after an upload or paste, closes when applied
  └─ panel:  Needs review (+ AI proposals) ─── at the side while it has items; Confirm data at its bottom

 GENERATE ──────── key feature: one Generate button
  ├─ step 1: Check "can this fit?" ─── the answer and numbers right below it
  └─ step 2: Generate · Cancel ─────── progress, then the status

 RESULTS ───────── key feature: the timetable grid
  ├─ bar:    which run (default: the chosen one) · Excel · PDF
  └─ tabs:   Timetable · Report · Score and assumptions · Run history

 Settings (corner link): the AI key
```

| Level | Rule |
|---|---|
| main page | a step of the flow, done in order |
| tab | only makes sense inside its page |
| panel | appears only after an event, closes when done |
| bar | one or two buttons |
| corner link | rarely used, outside the flow |

Common to every page: a status line (ready / working / an error with its message); pass and fail are never shown by
colour alone (always a word or symbol too).

## DATA
| Control | Where | Shows / holds | Action | States |
|---|---|---|---|---|
| table per section, one row per record | tab | the section's fields (problem.json) | add · edit · delete a row | empty: "nothing yet, add or upload" |
| on/off switch for Rooms and each optional field | tab | which parts are used | switching off greys the fields out; the report will say "not applied" | |
| position list | Teachers tab | head · instructor · other | picking one fills min and max hours (editable) | |
| list boxes for category, theory/practical, room type, day | tabs | the fixed lists (shapes.md) | | |
| Upload (.xlsx) | bar | file picker | reads the file, opens Column matching | loading · error (unreadable): offer Paste or Template |
| Paste | bar | rows copied from any spreadsheet program; asks the section and, for courses, the year | opens Column matching | |
| Template | bar | the upload template from the active fields | downloads it | |
| Data guide | bar | what an upload must contain, field by field | opens it | |
| column matching table | panel | each column: header, sample values, suggested field (list box), sure? | the teacher changes a match; then Apply | unmatched columns listed as "not used" |
| needs review list | panel | every unclear or guessed item, with file, sheet and row | click: jump to that row | empty: "nothing to review" |
| AI proposals | inside Needs review | one proposal per item, guesses flagged | accept · edit · reject | only when an AI key is saved |
| Confirm data | bottom of Needs review | | marks the data ready | off while Needs review has items |

## GENERATE
| Control | Where | Shows / holds | Action | States |
|---|---|---|---|---|
| "Can this fit?" button | step 1 | | runs the analysis | working (under a second) |
| answer + numbers | under it | ok or each cause; per group: needed vs possible; teacher periods vs min and max sums | | ok · infeasible |
| Generate button | step 2 | | starts a run | off while a run is working or the data isn't confirmed |
| Cancel button | step 2 | | stops the run | |
| progress | under it | elapsed time; the score while improving | | working |
| status | under it | the result in words (feasible, infeasible, search limit, …) | feasible: opens Results · otherwise: opens Results on the Report tab | done · failed |

## RESULTS
| Control | Where | Shows / holds | Action | States |
|---|---|---|---|---|
| run picker | bar | the runs; default the chosen one | switch which run the tabs show | |
| Excel · PDF buttons | bar | | download the shown run | off unless that run is feasible |
| view kind: Group · Teacher · Room · Course | Timetable tab | | switch the view | |
| who picker | Timetable tab | the view's keys | show another group / teacher / room | |
| grid | Timetable tab | rows = days, cells = lesson (spans its periods) · break · free | click a lesson: its details | empty: "no timetable yet" |
| course list | Timetable tab (Course) | every lesson, sorted by code | | |
| teacher load line | Timetable tab (Teacher) | this teacher's periods vs min-max | | inside · outside the band |
| rubric table | Report tab | per item 1.1-1.12, 2.1: passed · failed (count) · not applied | click: show that item's violations | |
| violation list | Report tab | rubric item, message, who / day / periods | click: open the Timetable tab at that cell | empty: "no violations" |
| Check again | Report tab | | runs the checker on the shown run | working |
| causes | Report tab | why no timetable, and likely causes, with numbers | | only when not feasible |
| teacher loads table | Report tab | every teacher: periods, min, max | | |
| score graph | Score tab | score per round, total and per term | | empty before improvement |
| assumptions list | Score tab | changed values, AI-accepted values with their original text, the engine's assumptions | | |
| run list | Run history tab | per run: time, status, score, rules passed, chosen | select up to two | empty: "no runs yet" |
| Compare | Run history tab | the two runs side by side: data changes, score per term, rules passed | | needs two selected |
| Use this run | Run history tab | | marks the run as chosen | |

## Settings (corner link)
| Control | Shows / holds | Action | States |
|---|---|---|---|
| AI provider (list box) | Groq · Gemini · OpenRouter (stack.md) | | |
| API key field | the user's own key; masked after saving | | |
| Save | | saves the key locally (never uploaded) | saved · error |
| Test | | sends one small request to the provider | works · fails (with the provider's message) · no internet |
| Remove key | | deletes the saved key; the AI assistant turns off | |
| AI status line | on (key saved and tested) · off | | |
