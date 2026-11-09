# Rubric template: how to write the rubric file

> Read when: the rubric changes (a new competition file). The current filled rubric is criteria-current.md; to
> redo it, follow this guide and replace that file.

## How to write it
1. Source: the rubric PDF in base/. Transcribe EVERY item; skip none.
2. One table, one row per item, plus one bold row per section: ID · points · the Thai original · a short English line.
3. Thai: copy the original wording exactly. PDF text extraction can break Thai vowels and tone marks: fix only the
   obvious ones, and say in the final note which ones you fixed.
4. Add the sums: each section's items against its heading, and all sections against the full score. When they
   differ, trust the items and write a note naming the heading that is wrong.
5. Copy the scoring rule and every footnote (e.g. "cannot be verified = 0").
6. Ranking: group the items by what must EXIST to earn them (a working engine, views, export, …). Rank 0 is what
   everything else needs, even if it earns little. The ranks must add up to the full score.
7. Disagreements: list every place where the plan (any README in restart/) breaks an item, with the item's id.

## Blank template

```
# Rubric (from base/<file>, transcribed <date>)

> Read when: deciding priorities or checking a rule's points. Key fact: <the main finding of the ranking>.

Competition: <name>. Full score <n>.
Scoring rule: <copied>.
Notes on the form: <copied footnotes>.

| ID | Pts | Thai (original) | English |
|---|---|---|---|
| **<section>** | **<pts>** | **<Thai>** | **<English>** |
| <id> | <pts> | <Thai> | <English> |

<sum notes>

## Ranked by what earns the points (build order follows this)
| Rank | What must exist | Items | Pts |
|---|---|---|---|
| 0 | <prerequisite> | <ids> | <pts> |

## Where the plan disagrees with the rubric
- <item id>: <what the plan does instead>
```
