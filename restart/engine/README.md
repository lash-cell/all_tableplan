# Engine plan

> Read when: building or fixing the engine. Key decisions: build each group's day left to right (rules hold by
> construction) · fixed lessons placed first (MRV) · method = build, then improve (techniques.md).

A build guide for the timetable engine. Its input and output are objects matching problem.json and result.json; the
exact fields are in shapes.md ("Input data", "Result"). Every number below written as a default (break periods 4-6,
finish 9/11, Thursday 6-7) is read from problem.json, never written into code.
The engine has two layers: a CORE that places lessons, and a CONSTRAINT layer of small, separate rules.
Sections: 1 day builder · 2 constraints · 3 analysis and search · 4 improvement · 5 checker and report.

| Takes | Gives out |
|---|---|
| problem object only (shapes.md). Never an .xlsx, a sheet or a column | result object (below) |

### Gives out
- **status:** feasible · infeasible (proven) · search limit (not a proof) · invalid input · validation failed (an
  engine bug, section 3d)
- **timetable** (only when feasible): one entry per lesson: course, groups, day, start period, end period, teacher
  (none for general education), room
- **report:** per constraint (H1-H12): passed · violations (who, what, when) · not applied (switched off); when not
  feasible: the causes in plain sentences
- **score history:** the soft score after each improvement round, per term (S1-S3) and in total
- **assumptions:** every modelling guess made

Files: this README (design) · techniques.md (method choice).

### Build order
1. The checker (all checks, section 5) FIRST, tested with one deliberately broken timetable per rule.
2. Then the search (sections 1-3), judged only by the checker. Never by its own opinion of itself.
3. Then improvement (section 4).

Why: the checker is the ruler. Built first, it tells every later step whether it works, and it alone already shows
the judges that the rules are checkable (R 1.x, "cannot be verified = 0").

---

## 1. Rules built into how the search moves (the day builder)

Some rules are cheaper to never break than to check. The core builds each group's day from left to right, and its
moves are shaped so these rules always hold. Nothing checks them during the search. The independent checker
still verifies them at the end, so the report can show them as checked.

### The rules this covers (student groups only)
| Rule | Source | How the moves guarantee it |
|---|---|---|
| Every group starts at period 1 | G17, R 1.11 | the day starts at period 1, and the first move must be a lesson |
| No gaps except the break | G2, R 1.11 | there is no "skip a period" move |
| One break, in one of the break periods (default 4, 5, 6) | G2, R 1.2 | the break is a move, allowed once, only at a break period |
| Finish by the year's limit | G1, R 1.1 | a lesson may not end after the year's limit (time.finishLimits; default 9 for ปวช.1, 11 otherwise) |
| A course is one consecutive block | G9, R 1.7 | a lesson is placed whole, in one move |
| Lessons every day | G19 | follows from "starts at period 1" |

Teachers need no break (G1). These rules apply only to student groups.

### One group's day
The builder keeps, per group and day: the next free period (p, starts at 1) and whether the break is taken.

```
 period:  1   2   3 │ 4   5   6 │ 7   8   9  10  11
          lessons   │ the break │ lessons ──────► end ≤ limit
          from 1,   │ is one of │
          no gaps   │ these     │
```

The three moves at period p:

| Move | Allowed when | Effect |
|---|---|---|
With B = the break periods (default 4, 5, 6), first = the smallest, last = the largest:

| Move | Allowed when | Effect |
|---|---|---|
| Place a lesson of duration d | its groups are all free at p · it ends by the limit · if the break isn't taken yet, it ends by last − 1 (default 5) · it doesn't run into a fixed lesson | p moves to p + d |
| Take the break | not taken yet · p is in B · no fixed lesson at p | p moves to p + 1 |
| End the day | the break is taken · p is last + 1 or later (default 7) | the group's day is closed |

Why "ends by last − 1 before the break": the break must come at the last break period at the latest.
Why "p is last + 1 or later": the break periods must hold exactly one free period, so all of them must be decided
first. (This assumes B is a run of consecutive periods, like 4-6; the input check rejects anything else.)

Examples of valid days:
```
 1-3 lesson · 4 break · 5-9 lesson · end            (a 5-period course fits after an early break)
 1-2 · 3-5 · 6 break · end                          (taught 1-5 only: valid)
 1-4 · 5 break · 6-7 · 8-11 · end                   (Years 2-3 only: the limit is 11)
```

### Fixed lessons: placed first (MRV)
A fixed lesson is a course with a fixed day and periods, e.g. activity/scout on Thursday 6-7 (G3). It has exactly
one possible place. MRV ("minimum remaining values": decide what has the fewest options first) says to decide it
first. So all fixed lessons are put on the grid BEFORE the search starts.

```
 1 pre-place every fixed lesson ──► 2 check them (below) ──► 3 the builder fills the rest around them
```

Checks on the pre-placed lessons, before any search. Any failure stops with a sentence naming the courses:
- two fixed lessons of one group overlap;
- a fixed lesson covers all of periods 4, 5 and 6 (no break fits);
- a fixed lesson ends after the year's limit;
- a fixed lesson's length differs from the course's periods.

Why first: their teacher and room use is known from the start, so an earlier choice can't take the last teacher
or room a fixed lesson needs. And the search effort goes only to the real choices.

During the build, the moves respect them:
- when p reaches a fixed lesson's start, stepping over it is the ONLY allowed move (it is already placed);
- no other move may cover a fixed lesson's periods: a lesson must end before it, and the break can't be taken on it.

MRV is used once more, in section 2: among the lessons that could start at p, try first the one with the fewest
places left to go.

### Shared lessons (theory: several groups at once)
A theory lesson belongs to all groups of its year (G4). It can only be placed when every one of those groups has the
same next free period p on that day. It is placed for all of them at once.

So the builder doesn't finish one group's day before starting the next. It always extends the group whose next free
period is the EARLIEST (ties: the first group in sorted group order). This keeps the groups level, so shared
lessons can line up, and clashes between groups show up immediately.

```
 Monday, the builder at work (Year 2 has groups A and B):
   A: [1-2 theory, shared] [3-5 ...] p=6
   B: [1-2 theory, shared] p=3   ◄── B is earliest, so B moves next
```

### A course too long for any day
A lesson longer than every possible day shape can never be placed. For example, with the break at 4 and a limit
of 11, the longest lesson after the break is 7 periods (5-11), and before the break it is 5 (1-5).
The analysis step (a later section) reports this before any search, naming the course.

### What this section does NOT cover
Which lesson to try first, teacher and room clashes, unavailable times, room types and workload are all rules of
the constraint layer. They are covered in section 2.

### Assumptions to record in every result
- The break is chosen per group and per day (G2 says every year has one break; it doesn't say all groups share it).
- A day with no lesson after the break (taught 1-5, break at 6) is valid.
- A lesson's periods are per week, placed as one block (G9).

---

## 2. The constraint layer

Every rule that section 1 doesn't build in is one CONSTRAINT: a small, separate piece with up to four parts.

| Part | Moment | Job | Required? |
|---|---|---|---|
| filter | during the search, before a move | "may this lesson go here?" Fast, answers yes/no | for speed only |
| lookahead | during the search, at a day start or a day end | "can the rest still be done?" Cuts dead branches early | for speed only |
| check | after the search | lists every violation in a finished timetable, with who, what and when | YES, always |
| score | after the search | soft constraints only: a penalty number (lower is better) | soft only |

- The CHECK is written separately from the filter and shares no code with it, so one bug can't hide in both.
  All checks together are the independent checker. Section 1's built-in rules get checks too.
- A constraint whose form section or field is switched off (data/README.md) is skipped everywhere, and the report
  lists it as "not applied", never "passed".
- A new rule on the day (a judge's requirement) needs only a check to be correct. A filter makes it fast.

### Two phases: WHEN first, then WHO and WHERE
In our data the engine chooses the teacher and the room. Choosing them during the time search makes it far
larger, so the search runs in two phases:

```
 phase 1  WHEN ─── the day builder (section 1) places every lesson in time.
                   Teacher and room constraints act here only as COUNTS: "enough free teachers and rooms exist".
 phase 2  WHO + WHERE ─ picks the actual teacher for each lesson, and a room for each lesson.
                   If that fails, ask phase 1 for its NEXT timetable (up to a limit).
```

The counts in phase 1 are necessary, not sufficient. They make phase 2 almost always succeed and fast.
When the data GIVES a course's teacher (course.teacherId, shapes.md), it is checked exactly in phase 1.

### The hard constraints
| Id | Rule | Source | Off when | Phase 1 filter | Phase 2 | Lookahead |
|---|---|---|---|---|---|---|
| H1 | a group is in one place at a time | G13, R 1.9 | never | built in (section 1) | | |
| H2 | day shape: start 1, one break 4-6, no gaps, finish limit, Mon-Fri, every day | G1, G2, G17-19, R 1.1, 1.2, 1.11 | never | built in (section 1) | | weekly reach (below) |
| H3 | one consecutive block per course · all periods placed | G9, G14, R 1.7, 2.1 | never | built in (section 1) | | |
| H4 | theory together, practical per group | G4, R 1.4 | never | built in: lessons are made this way from the data | | |
| H5 | fixed day and periods | R 1.12 | never | pre-placed (section 1) | | |
| H6 | activity and scout courses on Thursday 6-7 | G3, R 1.3 | never | becomes a fixed lesson (H5) when the data is read | | |
| H7 | a teacher teaches one lesson at a time | G11, R 1.8 | never | count: lessons needing a teacher ≤ free teachers, every period · a given teacher: free at every period of the lesson | one teacher per lesson, no double booking | period 1 at each day start (below) |
| H8 | teacher unavailable times | G15, R 1.10 | field off | count: an unavailable teacher isn't "free" · a given teacher: never there | never assigned there | |
| H9 | a room holds one lesson at a time · rooms by type | G6, G7, G12, R 1.6 | Rooms off | count per room type (below) | one room per lesson, no double booking | |
| H10 | room unavailable times | G15, R 1.10 | field off | count: an unavailable room isn't "free" | never assigned there | |
| H11 | teacher workload min and max | G5, G16, R 1.5 | field off | | each teacher's total within min-max | totals still reachable (below) |
| H12 | general-education lessons need no department teacher and count toward no workload | G8, G10 | never | not counted in H7 | not assigned | |

Every number in H1-H12 comes from the input data: finish limits, break periods and the activity slot from the Time
and limits section, workload min and max from each teacher (data/README.md). None is written into the engine. Test
it: change a value in the data, and the result must change with no code change.

Fixed decisions (not settings), each recorded as an assumption in every result:
- the break is chosen per group and per day;
- activity courses need a teacher and count toward teacher hours;
- general-education courses need no department teacher and count toward no workload (G10).

H6 needs the course category "activity" (data/README.md). An activity course with its own fixed time in the data keeps that
time only if it is Thursday 6-7. Otherwise both rules can't hold: report it before the search.

### Counting rooms by type
Rooms of one type are interchangeable for phase 1. At every period:
- computer-only lessons ≤ free computer rooms;
- lab-only lessons ≤ free labs;
- computer-only + lab-only + "computer or lab" lessons ≤ free computer rooms + free labs.

All three are needed: the third stops "either" lessons from taking rooms the others need. General classrooms for
general education are outside rooms that can be reused (G8): no count, unless the Rooms form lists them.

### Lookahead (cuts dead branches early)
| When | Question | If no |
|---|---|---|
| a group ends a day | can its remaining lessons still fill its remaining days? (which day lengths are possible, summed over the days left) | undo |
| a new day starts | can period 1 be staffed on each remaining day? (lessons that must start at 1 vs teachers free at 1; one shared theory lesson needs only one teacher for all its groups) | undo |
| phase 2, after each teacher choice | can every teacher still reach their minimum, and do the remaining hours still fit under the maximums? | undo |

Why period 1: every group starts at period 1 every day, so period 1 is where teachers run out first. On the old
sample data, Thursday and Friday needed one more teacher at period 1 than existed, unless a shared theory lesson
opened one year's day. A search that doesn't look ahead at period 1 finds this out days later and wastes its time.

### Which lesson to try first at period p (MRV again)
Among the lessons that may start at p for this group, try in this order:
1. a shared lesson, when all its groups are at p (it can't wait: the groups drift apart);
2. the lesson with the fewest places left to go: the longest first, then the rarest room type, then a given
   teacher with the most unavailable time;
3. ties: course code order (same input, same timetable).

The break and "end the day" are tried after all lessons.

### Soft constraints (the score, for improvement)
Used only after a valid timetable exists (techniques.md: build, then improve). Lower is better. Each term is shown
separately in the report, and the total is recorded after every improvement round (R 4.7, 4.8).

| Id | Penalty for | Why |
|---|---|---|
| S1 | each idle period between a teacher's lessons in a day | teachers' days are compact |
| S2 | each period a group is taught after the smallest finish limit in the data (default 9) | late finishes |
| S3 | the spread of teacher loads: for each teacher, load minus their band's middle; the score is the largest minus the smallest of these | fair workload |

Weights start at 1 each and are shown in the report. Change them only by the owner's decision. A new soft rule is
added here first (with its id and why), then in code.

### What is NOT a constraint
Room capacity: no student counts exist in the data, so it isn't checked. When the Rooms form has sizes and the
Groups form has student counts, it becomes H13 (size ≥ students).

---

## 3. Analysis and search

### 3a. Analysis: the "can this fit?" check (R 3.3, R 4.4)
Arithmetic only, no search, under a second. Every check is NECESSARY: if one fails, no timetable exists, and the
message says why, with the numbers. Passing them doesn't promise a timetable. The search reuses the same checks as
its lookahead (section 2), so write them once.

Layered, cheapest first. Stop at the first layer that finds a cause, but report every cause in that layer:

| Layer | Check | Example message |
|---|---|---|
| 1 sizes | a lesson longer than any possible day shape (section 1) | "Course X has 8 periods; the longest possible block is 7." |
| 1 sizes | per group: its periods must be a total the week's possible days can add up to | "ทค.1/1 needs 41 periods; at most 40 fit." |
| 2 fixed lessons | the four checks on pre-placed lessons (section 1) · two fixed lessons needing more teachers or rooms of a type than exist in one period | "Courses X and Y are both fixed on Monday 1-2 for ทค.2/1." |
| 3 teachers | counted teacher periods between the sum of the minimums and the sum of the maximums · each teacher has at least their minimum in available periods · period 1 can be staffed each day (section 2) | "Teachers need 180 periods; their maximums allow 170." |
| 3 rooms | per room type: lessons needing it ≤ rooms × periods in the week | "Lab lessons need 120 periods; 2 labs give 110." |

Answer: ok (not proven impossible) · infeasible + the causes · invalid input (data that can't be read, with the
course and field named).

### 3b. The search
Depth-first search over the day builder's moves (section 1), with the constraint filters (section 2) on every move.

```
 start: the fixed lessons pre-placed, every group at Monday period 1
 repeat:
   take the group with the earliest next free period (ties: sorted group order)
   try its allowed moves in order (section 2, "which lesson to try first")
   a move passes every filter? ── yes ──► make it; at a day end or day start, run the lookahead
                                └─ no ──► try the next move
   no move left ──► dead end: undo the last move, try that one's next option
 every group finished Friday and every lesson placed ──► a timetable (phase 1 done) ──► phase 2
```

Interchangeable lessons: lessons with the same groups, length, room type, teacher need and category are one CLASS.
At any point, only try the first unplaced lesson of a class. Swapping two of them changes nothing for phase 1, so
trying each would repeat the same work (7 identical lessons = 5,040 useless orders).

### 3c. Phase 2: who and where
Rooms first, then teachers. They never constrain each other, so they are two small searches, not one big one.

- Rooms: lessons in time order (fewest allowed rooms first on ties). Each gets an allowed room that is free for its
  whole block. Two free rooms of the same type in the same state are interchangeable: try only one.
- Teachers: lessons that need one, in time order. A lesson with a given teacher takes that teacher. Otherwise try
  the teachers who are free for the whole block, available, and still under their maximum, the one furthest below
  their minimum first. Teachers in the same state (same band, availability, load and busy periods) are
  interchangeable: try only one. After every choice, run the phase 2 lookahead (section 2).
- Phase 2 fails ──► ask phase 1 for its NEXT timetable (the search continues from where it stopped; it never
  restarts). Up to the attempt limit.

### 3d. Limits and honest statuses
| Limit | Default |
|---|---|
| time for the whole run | 30 s |
| search steps | set by the engine, reported in the result |
| phase 1 timetables tried by phase 2 | 8 |

Check the clock every thousand steps or so, in every search loop (phase 1, rooms, teachers).

| What happened | Status |
|---|---|
| analysis found a cause | infeasible + causes |
| the search tried every option, found nothing, no limit hit | infeasible ("the search tried every option") |
| a limit was hit before any timetable | search limit + which limit + "not a proof that no timetable exists" |
| timetables found, phase 2 failed on all of them | search limit, or infeasible only if every phase 1 timetable was tried |
| a timetable passed phase 2 and the checker | feasible |
| the checker found a violation in the engine's own timetable | an engine bug: report it as "validation failed", never show the timetable |

When a search ends without a timetable but the analysis passed, find suspects: run the search again with ONE
constraint group switched off at a time (5 s each, in this order). A group whose removal gives a timetable is listed
as a "likely cause". It is a suspect, not a proof, and the message says so.

| Group | Switches off | Message names |
|---|---|---|
| fixed slots | H5 (each course's own fixed time; the activity slot H6 stays) | the fixed courses |
| teacher unavailability | H8 | the teachers with unavailable times |
| given teachers | the course.teacherId part of H7 | the courses with a given teacher |
| workload | H11 | the teachers whose min or max is tight |
| rooms | H9, H10 | the room types that run out |

The day shape (H1-H4) and the activity slot (H6) are never switched off: they are the guideline's core rules, and
the builder can't work without the day shape.

Measure every run: steps, milliseconds, and the top reasons moves were rejected (per constraint). Put them in the
result. When the search is slow, read these before changing anything.

### 3e. Same input, same timetable
Fixed orders everywhere: sorted groups, sorted lessons, sorted teachers and rooms. No randomness in sections 1-3.
Nothing may depend on the order the data was entered or on the time of day.

---

## 4. Improvement (R 4.7, 4.8)

Starts from a feasible timetable. Lowers the soft score (S1-S3, section 2) and never breaks a hard rule.

### Moves
| Move | Allowed when |
|---|---|
| swap two lessons of one group that have the same length | neither is fixed; a shared lesson only swaps with a shared lesson of the same groups |
| give a lesson another teacher | not a given teacher (course.teacherId) · the new teacher is free, available and stays inside their min-max; the old one stays above their minimum |
| give a lesson another room | the room is allowed and free for the whole block |

Swapping equal lengths keeps every day's shape, so section 1's rules stay true by construction.

### The loop: late acceptance
```
 repeat until the time budget ends (default 10 s) or 1,000 rounds bring no improvement:
   pick a move (from a random generator with a FIXED seed, stored in the result)
   the move breaks a hard rule (filters, then the checks of the affected days) ──► skip it
   new score ≤ current score, or ≤ the score of L rounds ago (L = 50) ──► keep it
   otherwise ──► undo it
   record the score after every round
```
Late acceptance is chosen because it has one setting (L) and accepts a slightly worse move now and then, so it doesn't
get stuck. Same input and same seed give the same result.

### What it gives out
- the improved timetable (checked again by the checker before it is returned);
- the score history: the total and each term (S1-S3) per round. That is the R 4.8 graph;
- the score before and after, the moves tried, kept and skipped.

If improvement finds nothing better, the first feasible timetable is returned unchanged. That is a correct result.

---

## 5. The checker and the report

### The checker
Written from the rules in this file, never from the search code: it shares nothing with sections 1-4. Given ANY
timetable plus the input data, it recomputes everything:

| Check | Constraint | Rubric |
|---|---|---|
| each group, each day: starts at 1, exactly one free period in the break periods, no other gap, ends by the limit, every school day has lessons | H2 | 1.1, 1.2, 1.11 |
| each lesson is one block of its full length; every course placed exactly once for each of its groups | H3 | 1.7, 2.1 |
| theory lessons hold all groups of the year together, practicals one group each | H4 | 1.4 |
| fixed lessons at their fixed place; activity courses at the activity slot | H5, H6 | 1.12, 1.3 |
| a course with a given teacher (course.teacherId) is taught by that teacher | H7 | 1.12 |
| no group, teacher or room used twice in one period | H1, H7, H9 | 1.9, 1.8, 1.6 |
| every lesson in an allowed room type | H9 | 1.6 |
| no teacher or room used while unavailable | H8, H10 | 1.10 |
| general education has no teacher; every other lesson has exactly one | H12, H7 | 1.5 |
| each teacher's counted periods inside their min-max | H11 | 1.5 |

Each violation names who, what and when, e.g. "ทค.2/1 has a gap on Friday period 4."

Tests: take one valid timetable. For each row above, copy it, break exactly that rule, and check that the violation
appears and names the right rubric item. At least 12 tests.

### The report (output/ draws it)
- per rubric item (1.1-1.12, 2.1): passed · failed with the number of violations · not applied (switched off);
- every violation: rubric item, constraint id, message, and what it refers to (group, teacher, room, day, periods);
- teacher loads: each teacher's periods against their min-max (R 2.3);
- when no timetable: the status, the causes (section 3), the likely causes if any;
- the assumptions and the measurements (steps, ms, rejection reasons).

The checker also runs on request ("check again"), so a judge can see it verify the timetable live.
