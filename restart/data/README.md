# Data: putting the problem in

> Read when: building forms, upload, column matching or the data guide. Key decisions: the form is the one data
> definition (upload template and guide come from it) · nothing is guessed silently · AI only proposes.

Step 1 of the flow (README.md). Sources: G = base/guideline.pdf · R = rubric item (criteria-current.md).

| Takes | Gives out |
|---|---|
| the teacher's form entries · an uploaded .xlsx · pasted rows · words.json · defaults.json | problem.json: the input data (below), confirmed by the teacher (shapes.md) |

## The form is the one data definition (G 1a-1e, R 3.1)
The upload template and the teacher's data guide are made from it, so the three can never disagree.

```
 form sections (teacher switches optional ones on/off)
      ├──► the form the teacher fills in
      ├──► the upload template (exactly the active fields)
      └──► the data guide: what an upload must contain, field by field
```

## Gives out: the input data
| Section | Fields | Can be switched off? |
|---|---|---|
| Groups | years, the student groups in each year (e.g. ทค.1/1, ทค.1/2) | no |
| Courses | code, name, year, periods per week, theory/practical, category · optional: fixed day + periods, room type | no |
| Teachers | name, position, min hours, max hours · optional: unavailable times, courses they teach | no |
| Rooms | name, type · optional: size, unavailable times | yes: then room rules are not applied |
| Time and limits | school days, periods per day, finish limit per year, break periods, activity slot | no (see "Values" below) |

Plus: which sections and fields are switched off (the engine reports their rules as "not applied").

## Values: from the file, else from the teacher
The rule numbers live in the Time and limits section, never in the engine's code.

| Value | Guideline value | Source |
|---|---|---|
| school days | Monday-Friday | G18 |
| finish limit per year | ปวช.1: period 9 · other years: period 11 | G1 |
| break periods | 4, 5, 6 | G2 |
| activity and scout slot | Thursday, periods 6-7 | G3 |

```
 the uploaded file has the value? ── yes ──► use it, shown in the form
          │ no
          ▼
 the form shows the guideline value ──► the teacher confirms or changes it
```

- A value that differs from the guideline is an ASSUMPTION: it is listed in the assumptions panel (output/README.md).
- Break periods must be consecutive (e.g. 4, 5, 6): anything else is a "needs review" item (the engine relies on it).
- Workload min and max are NOT here: they are per teacher, in the Teachers section.

- Min and max hours are filled in from the position, using the guideline (head of department or head of section 24-28,
  instructor 30-38), and the teacher can change them (G5).
- Room type is picked from one short list shared by courses and rooms: computer · lab · computer or lab · general
  classroom. Never free text.
- Course category is picked from: general education · department · activity (activity and scout: Thursday 6-7, G3).
- Periods are per week. A course is one block of that many consecutive periods (G9).
- Everything read from a file is shown to the teacher and can be corrected before it is used.
- Nothing is guessed silently. Anything unclear is shown as "needs review".

## Uploading a file that doesn't follow our template
```
 upload (.xlsx) ──► system suggests: this column = course name, this one = periods, …
                ──► teacher corrects the matches ──► rows shown in the form ──► teacher confirms
```
- Matching is by column meaning (Thai or English header), never by column position.
- Unmatched columns are kept and shown, never used as rules.
- Other file types (.csv, .xls, PDF) are a later item.

## Reading text into form values (rung 1, automatic)
Each rule only SUGGESTS a value; anything it can't match goes to "needs review". Thai and English go through the
same small word lists, so a new synonym is one added word.

| Source text | Becomes | Words / pattern |
|---|---|---|
| room description | room type | a computer word → computer · ปฏิบัติการ / laboratory → lab · both → computer or lab · else → general classroom |
| position | position (fills min/max) | หัวหน้าแผนก, หัวหน้างาน, "Head" → head · ครูประจำแผนก, "Instructor" → instructor |
| requirement: a day word and a period range anywhere in the sentence ("จัดอยู่ในวันจันทร์คาบที่ 1-2", "Scheduled Monday, periods 1-2") | fixed day + periods | day words: จันทร์ อังคาร พุธ พฤหัส (also พฤหัสบดี) ศุกร์ / Monday-Friday · range: two numbers joined by "-" after คาบ / คาบที่ / period / periods |
| teacher note with "ต้องว่าง" / "must be free" + a day + a range ("ต้องว่างวันพุธคาบที่ 1-4", "Must be free on Wednesday, periods 1-4") | unavailable times | the teacher must be FREE then, so: unavailable for teaching |
| a sentence with a day or range that doesn't fit the patterns above | nothing | "needs review" (rung 3) |
| section heading row above the courses | category | รายวิชาสามัญ, สามัญ / General Education → general education · รายวิชาของแผนกวิชา, แผนกวิชา / Department → department · course names with กิจกรรม or ลูกเสือ / activity, scout → activity (suggested, review) |
| sheet name (e.g. ปวช.1, Vocational Certificate Year 1) | year | the sheet name as written |
| title row (e.g. "กลุ่ม ทค.1/1-2", "Groups: TC.1/1-2") | groups | "X/1-2" → X/1 and X/2 (a range after the last "/"); "X/1, X/2" → as listed; anything else → "needs review" |
| position text not in the word list | position "other" | "needs review": the teacher fills min and max |

### Header synonyms (for column matching)
The words below are the starting content of words.json (shapes.md); the code reads them from that file.
A header matches a field when it CONTAINS one of the words (case and spaces ignored). Only the fields of the sheet's
type are tried (so "ข้อกำหนด" is the requirement on a course sheet and the teacher note on a teacher sheet, and "name"
on a course sheet never means a teacher). The longest matching word wins; two fields still tied → "needs review". These are generic words, not the sample's exact headers; add synonyms here, never in code.

| Field | Thai words | English words |
|---|---|---|
| course code | รหัสวิชา, รหัส | course code, code, subject code |
| course name | รายวิชา, ชื่อวิชา | course name, subject, course title |
| periods per week | ชั่วโมง, ชม., คาบ, จำนวนคาบ | hours, periods, hrs |
| theory/practical | ประเภทวิชา, ทฤษฎี/ปฏิบัติ | course type, type |
| requirement (fixed slot) | ข้อกำหนด, เงื่อนไข | requirement, requirements, condition |
| room description | ห้อง, ห้องที่ใช้สอน, ห้องเรียน | room, teaching room, classroom |
| teacher name | ชื่อครู, รายชื่อครู, ครู, ผู้สอน | teacher, teacher name, name |
| position | ตำแหน่ง | position, role |
| teacher note (unavailable) | ข้อกำหนด, เวลาไม่สะดวก, หมายเหตุ | requirements, availability, unavailable, note |

Which sheet holds what: a sheet whose headers match course fields is a course sheet; teacher fields → a teacher
sheet; neither → "document" (ignored, the teacher can change it). Values in the theory/practical column: ทฤษฎี /
theory → theory · ปฏิบัติ / practical → practical.

Traps proven on the sample files:
- A course NAME can contain ปฏิบัติการ too ("การใช้งานระบบปฏิบัติการ" = operating systems): never read room type or
  theory/practical from the name.
- The group title is split into several rich-text pieces ("กลุ่ม ทค" + ".1/1-2"): join the pieces before reading it.
- ปฏิบัติการ (lab) contains ปฏิบัติ (practical): read theory/practical ONLY from its own column, room type ONLY from
  the room column.
- The section heading is a merged cell, so its text repeats in every column. A title row sits above the header row.
- Cells can be rich text, a formula with its result, a link or a date: always take the plain text.
- Keep the source text exactly (e.g. "20000 - 1101" keeps its spaces); trim only outer spaces. The sample is
  inconsistent ("20000 - 1101" but "20000 -1603"), so codes are COMPARED with all spaces removed.
- The Thai and English sample workbooks are the SAME records in two languages: uploading both must give a duplicate
  warning, not double data.
- Rows that aren't data (title, header, heading, repeated header, totals) are skipped, each listed with its reason.
  Nothing is dropped silently.

Several uploads, and pastes:
- Each upload or paste ADDS records to the current problem.json; it never wipes what is there.
- A duplicate is a course with the same code (compared without spaces), or a teacher with the same name. The year
  is NOT compared: the Thai and English copies of one workbook name it differently ("ปวช.1", "Vocational
  Certificate Year 1"). It is a warning: the teacher keeps one of the two.
- Teacher names differ between languages too ("คุณครู A", "Teacher A"): after a duplicate course warning between two
  files, the teacher sheets of those files are flagged as a likely duplicate as well.
- Pasted rows have no sheet name: the paste asks for the section and, for courses, the year.
- Columns that match no field are kept on the record as `extra` (shapes.md), shown, and never used as rules.

Safety at upload: files over 30 MB are refused · the original file is kept unchanged · ids from outside are checked
against a strict pattern before any file path is built from them.

## When reading fails: the fallback ladder
The file opens, but its contents can't become usable data (strange layout, unknown headers, unreadable sentences,
a scan, another file type). Each rung is slower but more certain. The last one always works.

| Rung | What the teacher does | Covers |
|---|---|---|
| 1 automatic | nothing: the system matches columns by meaning | files like the sample |
| 2 correct the match | pick the sheet type, the header row and the field for each column | other layouts, unknown headers |
| 3 fix cells | each unreadable cell is listed as "needs review" with file, sheet and row; the teacher fills the form field (e.g. a requirement sentence becomes fixed day + periods) | sentences, odd values |
| 4 AI proposes (only if installed) | the AI suggests matches and values; the teacher confirms each one | messy files, free text |
| 5 paste | copy rows from the judges' file in any spreadsheet program, paste into the section's table; the columns are matched as in rung 2 | anything a spreadsheet can open (.xls, .csv, .ods) |
| 6 template | download our template, copy the judges' data into it, upload it | anything, when paste is clumsy |
| 7 type | enter the rows in the form by hand | everything, including scans and paper |

Rules:
- A file is never all-or-nothing: what was read is kept, and only the failed parts drop to a lower rung.
- The teacher always sees which rung each record came from (shown in "needs review" until confirmed).
- Rungs 5-7 need no reading code at all, so the system can always be fed, even when every reader fails.

## Judges' custom requirements
Entered by hand on the day, through the form fields above (fixed slots, unavailable times, who teaches what).
No separate rule system is planned.

## AI assistant (optional, undecided)
Job: turn messy input (odd file layouts, free-text sentences from the judges) into PROPOSED data or rules.
- On only when the user has saved their own API key in Settings (stack.md); otherwise rung 4 is simply skipped.
- It receives ONLY the failed pieces (a header with a few sample values, or one sentence), never the whole file.
- It works only here, in the data step. The engine, the checker and the output never call it.

What it may propose, per "needs review" item:
| Item | May propose | Never |
|---|---|---|
| an unmatched column header | which field it is | |
| a sentence (requirement, teacher note) | fixed day + periods · unavailable times | a new kind of rule |
| a group title that didn't expand | the list of groups | |
| an unknown position | head · instructor · other | min and max hours (they come from the position, defaults.json) |
| a category | general education · department · activity | |
| a duplicate | nothing: the teacher decides | |

- Each request carries the item's original text and the field's allowed values (shapes.md), so the AI picks from a
  list instead of inventing one.
- Its answer is UNTRUSTED input: every proposal goes through the same input check as an upload (allowed values,
  valid days and periods). One that fails is dropped with a note, never shown as a suggestion.
- An accepted proposal is marked `how: "ai"` in its source (shapes.md), so the assumptions panel can list it.
- The teacher confirms every proposal before it is used.
- The system works fully without it (no internet on demo day).
