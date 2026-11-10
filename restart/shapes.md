# Shapes: the exact data passed between parts

> Read when: building anything that gives data to, or takes data from, another folder. Key rule: these names are
> the ONLY names. A part that needs a new field proposes it here first; it never invents one in code.

## Data contracts and persistence: data is never code
Parts pass objects matching these JSON contracts. The engine never sees an .xlsx, a sheet name or a column, and no
data value is ever written into code. The app persists mutable state in one built-in `node:sqlite` database under
the ignored `data/` folder; `problem.json`, `result.json` and Run remain the exact serialized contracts and test
fixture formats, not separate live persistence files.

| Contract or file | Holds | Produced or persisted by | Read by |
|---|---|---|---|
| problem.json | Input data (below) + `format` (a version number, starting at 1); the current input is persisted in SQLite | data/ (upload, paste, form, AI) | engine/, output/ |
| result.json | Result (below) + `format`, one per run; persisted with its Run in SQLite | engine/ | output/ |
| Run | Run (below), holding a copy of its problem and its result; persisted in SQLite | server/ | output/, the screens |
| words.json | the word lists: header synonyms, day words, room words, position words, category words, skip-row words | the owner (shipped with the app) | data/ |
| defaults.json | the guideline values: time, break periods, finish limits, activity slot, workload bands per position | the owner (shipped with the app) | data/ (fills the form) |

- Adding a synonym or changing a guideline value = editing words.json or defaults.json. Never code.
- Tests use files too: each test set is a problem.json plus an expected.json with the numbers it must give
  (demo-day.md). Engine and output tests never open an .xlsx.
- A part that can't do its job with only its input objects has a missing field: propose it in this file.

Conventions:
- Field names in camelCase, as written here. Text values in the lists below are written exactly as shown.
- `day` is a number: 0 = the first school day in `time.days` (Monday by default). Periods count from 1.
- A range `{day, start, end}` includes both ends: start 1, end 2 = periods 1 and 2.
- Ids are short text made by the system: letters, digits and "-" only. Anything from outside is checked against
  this before use.
- Messages the teacher reads are Thai.

## Input data (data/ gives, everyone takes)
| Field | Type | Meaning | Example |
|---|---|---|---|
| groups | list of Group | | |
| courses | list of Course | | |
| teachers | list of Teacher | | |
| rooms | list of Room | empty when the Rooms section is off | |
| time | Time | | |
| off | list of {section, field} | switched-off parts; field empty = the whole section | [{section: "rooms", field: ""}] |
| review | list of ReviewItem | must be empty before confirming | |
| confirmed | yes/no | | |

Group
| Field | Type | Meaning | Example |
|---|---|---|---|
| id | id | | "g-1" |
| name | text | as the school writes it | "ทค.1/1" |
| year | text | the year it belongs to | "ปวช.1" |

Course
| Field | Type | Meaning | Example |
|---|---|---|---|
| id | id | | "c-12" |
| code | text | exactly as the source wrote it | "20000 - 1101" |
| name | text | | "ภาษาไทยเพื่อการสื่อสาร" |
| year | text | which year takes it | "ปวช.1" |
| periods | whole number ≥ 1 | per week, one block (G9) | 2 |
| kind | "theory" or "practical" | | "theory" |
| category | "general", "department" or "activity" | | "general" |
| fixed | range or empty | a fixed day and periods | {day: 0, start: 1, end: 2} |
| roomType | "computer", "lab", "computerOrLab", "general" or empty | | "general" |
| teacherId | id or empty | a GIVEN teacher; empty = the engine chooses. The same teacher for every group's section | "t-1" |
| source | Source | | |

Teacher
| Field | Type | Meaning | Example |
|---|---|---|---|
| id | id | | "t-1" |
| name | text | | "คุณครู A" |
| position | "head", "instructor" or "other" | | "head" |
| minPeriods, maxPeriods | whole numbers | filled from the position, editable | 24, 28 |
| unavailable | list of range | | [{day: 2, start: 1, end: 4}] |
| source | Source | | |

Room
| Field | Type | Meaning | Example |
|---|---|---|---|
| id | id | | "r-com1" |
| name | text | | "COM1" |
| type | "computer", "lab" or "general" | | "computer" |
| size | whole number or empty | | |
| unavailable | list of range | | [] |

Time
| Field | Type | Meaning | Example |
|---|---|---|---|
| days | list of text | the school days, in order; position = day number | ["Monday", …, "Friday"] |
| periodsPerDay | whole number | | 11 |
| breakPeriods | list of whole numbers | | [4, 5, 6] |
| finishLimits | list of {year, lastPeriod} | | [{year: "ปวช.1", lastPeriod: 9}] |
| activitySlot | range | | {day: 3, start: 6, end: 7} |
| fromGuideline | list of field names | which values are still the guideline's (the rest are assumptions) | ["breakPeriods"] |

Course and Teacher also have `extra`: a list of {header, value} for source columns that matched no field (shown,
never used as rules).

Source: `{how: "file", file, sheet, row}` or `{how: "paste"}` or `{how: "form"}` or `{how: "ai"}`, plus `confirmed` yes/no.

ReviewItem: `{id, section, recordId, field, problem, original}` (original = the source text, e.g. the unread sentence).

## Analysis (engine gives, the Check screen takes)
| Field | Type | Meaning |
|---|---|---|
| status | "ok", "infeasible" or "invalidInput" | |
| causes | list of {layer, message, refs} | layer 1-3 (engine 3a); empty when ok |
| groups | list of {groupId, needed, possibleMin, possibleMax} | periods per week |
| teachers | {counted, minSum, maxSum} | |

## Lesson (one placed course block)
| Field | Type | Example |
|---|---|---|
| id | id | "l-40" |
| courseId | id | "c-12" |
| groupIds | list of id | ["g-1", "g-2"] (theory: all groups of the year) |
| day, start, end | numbers | 0, 1, 2 |
| teacherId | id or empty | empty for general education |
| roomId | id or empty | empty when rooms are off, or a general classroom with no room list |

## Result (engine gives, output takes)
| Field | Type | Meaning |
|---|---|---|
| status | "feasible", "infeasible", "searchLimit", "invalidInput" or "validationFailed" | engine 3d |
| lessons | list of Lesson | only when feasible |
| analysis | Analysis | always, except invalidInput |
| report | Report | |
| scoreHistory | list of {round, total, terms: {S1, S2, S3}} | empty when not feasible |
| seed | whole number | the improvement step's fixed seed |
| assumptions | list of text | |
| stats | {steps, ms, limitHit, rejections: list of {constraint, count}} | limitHit: "", "time" or "steps" |

## Report
| Field | Type | Meaning |
|---|---|---|
| items | list of {rubricId, result, count} | result: "passed", "failed" or "notApplied"; rubricId like "1.8" |
| violations | list of Violation | |
| teacherLoads | list of {teacherId, periods, minPeriods, maxPeriods} | |
| causes | list of text | why no timetable (empty when feasible) |
| likelyCauses | list of text | suspects from switching rule groups off (engine 3d) |

Violation: `{rubricId, constraint, message, groupIds, teacherId, roomId, day, start, end}` (constraint like "H7").

## Run (output keeps, the screens show)
| Field | Type | Meaning |
|---|---|---|
| id | id | "run-7" |
| createdAt | date and time text | |
| state | "running", "finished", "cancelled" or "failed" | "failed" = a crash or timeout, NOT "finished + infeasible" |
| input | Input data | a copy, so later edits can't change the run |
| result | Result or empty | when finished |
| error | text or empty | when failed |
| chosen | yes/no | at most one run is chosen |

## View (output gives, the screens draw)
| Field | Type | Meaning |
|---|---|---|
| kind | "group", "teacher", "room" or "course" | |
| keys | list of {id, label} | the picker; sorted by label |
| key | id | the one shown |
| rows | list of {day, dayName, cells} | not for the course view |
| lessons | list of Lesson plus code, name, groupNames, teacherName, roomName | course view only, sorted by code |

Cell: `{type, start, end}` with type "lesson", "break" or "free"; a lesson cell also has `lesson` (the Lesson plus
code, name, groupNames, teacherName, roomName). The cells of a row cover periods 1 to periodsPerDay exactly once.

## Match proposal (data/ gives the Data screen, after an upload or paste)
| Field | Type | Meaning |
|---|---|---|
| sheets | list of {name, sheetType, headerRow, columns, sampleRows} | sheetType: "courses", "teachers" or "document" |
| columns | list of {index, header, samples, field, sure} | field empty = not used; sure no = "needs review" |
| skipped | list of {sheet, row, reason, preview} | reason: "title", "header", "heading", "repeatedHeader", "total", "empty" |
| warnings | list of text | e.g. "two files hold the same records" |
