# Ingest: teacher data to confirmed problem

## What this part does

Ingest accepts a spreadsheet, pasted rows, or form entries and turns them into one validated problem that the
engine can use. It makes uncertainty visible: unclear values are reviewed, not silently guessed.

## Process schema

```text
 TEACHER PROVIDES DATA
    ├── form
    ├── .xlsx upload
    └── pasted spreadsheet rows
            │
            ▼
     1. READ SOURCE
        ExcelJS reads workbook cells as plain text
            │
            ▼
     2. IDENTIFY SHEETS AND ROWS
        courses / teachers / other document
        separate headers, titles, headings, totals, and data
            │
            ▼
     3. SUGGEST COLUMN MATCHES
        words.json synonyms → likely field for each column
            │
            ▼
     4. TEACHER REVIEWS MATCHES
        correct sheet, header, or field mapping
            │
            ▼
     5. CONVERT ROWS TO INPUT RECORDS
        groups · courses · teachers · rooms · time settings
            │
            ▼
     6. VALIDATE AND FLAG
        invalid values · unclear text · skipped rows · duplicates
            │
            ▼
     7. RESOLVE REVIEW ITEMS
        teacher fixes each item; optional AI may suggest, never decide
            │
            ▼
     8. CONFIRM AND SAVE
        review list empty → teacher confirms → save current problem in SQLite
            │
            ▼
       ENGINE MAY USE CONFIRMED INPUT
```

## What happens at each step

1. **Receive:** The teacher uses the form, uploads an `.xlsx`, or pastes rows. Paste asks which section it belongs
   to and, for courses, which year.
2. **Read:** The planned ExcelJS reader joins rich text, takes formula results, and converts cells to plain text.
   The original upload remains unchanged.
3. **Identify:** The system recognizes course and teacher sheets from their headers. Irrelevant sheets and
   non-data rows are identified rather than turned into records.
4. **Match:** Generic Thai and English header synonyms in `words.json` suggest fields. The match is based on
   meaning, not column position. The teacher can change every suggestion.
5. **Convert:** Recognized rows become the agreed input fields. Synonyms and allowed values are data files, not
   special cases in code.
6. **Validate:** Invalid or unclear values become review items. Unknown columns are preserved as extra information
   but never used as scheduling rules. Duplicate uploads warn the teacher; uploads add records instead of replacing
   current data.
7. **Resolve:** The teacher corrects unclear values. Optional AI may propose interpretations for individual failed
   pieces, but its proposal is validated and must be approved by the teacher.
8. **Confirm:** The teacher can confirm only when review items are resolved. The server then saves the current
   problem in SQLite. Generation requires confirmed data.

## Fallback path

If automatic reading cannot understand the source, the teacher can correct the matches, fix individual cells,
optionally review AI suggestions, paste rows, use the upload template, or enter data by hand. The app can still be
used without AI or internet.

## Planned tools and boundaries

- **ExcelJS:** read `.xlsx` files.
- **`words.json`:** header synonyms and words used to interpret input.
- **`defaults.json`:** guideline values shown in the form.
- **Optional AI:** proposes interpretations for unclear input only; it does not schedule or verify.
- **Output:** one confirmed problem object matching the contract in [shapes.md](../../restart/shapes.md).

Details: [data/README.md](../../restart/data/README.md).
