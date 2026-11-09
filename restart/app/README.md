# App: the screens (handoff to the partner)

> Read when: preparing the screen list for the partner. Key decision: agents BUILD NOTHING here. They write down what
> each screen must show and do, as plain controls. The partner designs and builds the real frontend.

Files: screens.md (what each screen shows and does) · routes.md (what each screen calls, with shapes.md names).
Both go to the partner.

## What an agent produces in this folder
One file, screens.md (written; keep it in step when another folder's "Gives out" changes): every screen, each with
the table below. Plain words only: no styling, colours, layout
choices or code. Take the content from data/, engine/ and output/ ("Gives out" sections).

| Column | Content |
|---|---|
| Control | what it is: form field · list box · checkbox · button · table · grid · file picker · message |
| Shows / holds | which data, by its field name in the "Gives out" section it comes from |
| Action | what happens when the user uses it (e.g. "runs the check, then shows the report screen") |
| States | empty · loading · error · done, when they differ |

## The screens to list (from the flow in README.md)
1. Data: the form sections, the switches for optional sections and fields, upload, column matching, review and
   confirm, "needs review" items.
2. Check: the "can this fit?" button and its answer.
3. Generate: the button, progress, cancel, the result status.
4. Views: group / teacher / room / course, with a picker for which one.
5. Report: the check report, the score history and the assumptions panel.
6. Run history: the list of runs, compare two, mark one as chosen.
7. Export: Excel and PDF buttons.

## Rules
- Every control traces to a field or action in another folder's "Gives out". A control with no source is a question
  for the owner, not an invention.
- One screen, one table. Nothing else.
