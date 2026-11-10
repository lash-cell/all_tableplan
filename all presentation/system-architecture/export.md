# Export and results

This page describes the target export architecture. TimeTableMaker 1.0 does not yet implement the saved-run,
score-history, or Excel/PDF export pipeline. ExcelJS currently reads `.xlsx` input; ExcelJS export is planned.

## What this part does

Output takes a saved run and prepares the timetable views, explanations, history, and downloadable files. The
screen and exports use the same checked result.

## Results process schema

```text
Saved run
  ├── input copy: what the engine used
  └── result: status, lessons, report, assumptions, score history
         │
         ▼
  Is there a feasible, checker-passed timetable?
       ├── no ──► show status, causes, report, assumptions, run history
       │          do not offer a timetable file
       │
       └── yes ─► build views from the result
                    ├── group timetable
                    ├── teacher timetable and workload
                    ├── room timetable
                    ├── course list
                    ├── rule report and assumptions
                    ├── score history and run comparison
                    └── chosen run → Excel / PDF
```

## What the teacher sees

- **Timetable views:** by student group, teacher, room, or course.
- **Rule report:** passed, failed with explanations, or not applied. Violations identify who and when.
- **No-timetable explanation:** causes and likely causes when generation did not produce a feasible timetable.
- **Teacher workload:** periods compared with each teacher's minimum and maximum.
- **Assumptions:** changed guideline values, teacher-approved AI suggestions, and engine assumptions.
- **Score history:** how the quality score changed during improvement.
- **Run history:** previous attempts, comparisons, and the run the teacher chose.

The report should explain problems in plain language, not reduce them to a pass/fail badge. Selecting a violation
can take the teacher to the affected timetable slot.

## File downloads

- Only a **chosen, feasible** run can be exported.
- Excel sheets are built from the same grids as the screen, with one sheet per group, teacher, and room, plus all
  lessons.
- PDF contains printable timetable pages. pdfmake with Sarabun is the first choice, pending a test that confirms
  Thai and Latin text render correctly.
- A non-feasible run remains available for its report, but cannot be downloaded as a timetable.

**Planned technology:** ExcelJS for Excel. pdfmake with Sarabun is the first PDF choice, pending a rendering test
that confirms Thai and Latin text; Puppeteer and LibreOffice are backups if it fails. Details:
[output/README.md](../../restart/output/README.md) and [routes.md](../../restart/app/routes.md).
