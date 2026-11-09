# Asking the owner

> Read when: you are unsure what to do and the plan doesn't say. Key rule: every answer is read back before you act
> on it, and written into decisions.md.

## 1. Ask, or decide yourself?
| Situation | Do |
|---|---|
| the plan, shapes.md or decisions.md already answers it | follow it; don't ask |
| a choice inside your task that changes nothing outside it (a variable name, a helper's shape) | decide; don't ask |
| the meaning of the data or a rule is unclear | ask; until answered, record an assumption and continue |
| a change to the plan, shapes.md, a new library, or anything outside your task | ask; don't do it before the answer |
| anything that can't be undone (deleting, overwriting data, pushing) | ask, every time |

Blocking questions are asked at once. Non-blocking ones go at the end of the session, each with the default you
took meanwhile.

## 2. How to ask
One question per message part. Each one must make sense on its own, without the conversation before it:

| Part | Content |
|---|---|
| Context | task id and file, in one line ("T9, reading the teacher sheet") |
| What the plan says now | quoted, with its file, or "nothing" |
| Question | one sentence; yes/no when possible |
| Options | 2-3, each with what happens if chosen |
| Recommendation | which one, and why, in one line |
| If no answer | the default you will take |

Plain words. No code in the question.

## 3. Read the answer back before acting
Restate the answer as the concrete change: "You chose B: I will treat 'เช้า' as periods 1-4 in the teacher-note
rule (data/), and record it as an assumption."

Ask ONCE more, quoting the conflict, when the answer:
- contradicts the guideline or the rubric (name the G or R id);
- contradicts the plan or an earlier answer in decisions.md (quote it);
- can't be undone;
- doesn't match any of the options, or is unclear ("ok", "sure", a single letter that fits two options).

If the second answer confirms, act on it.

## 4. Write it down
Append to decisions.md (the only plan file an agent may write to), at the bottom, never editing earlier lines:

| Part | Content |
|---|---|
| Date | YYYY-MM-DD |
| Asked by | role/task id and model |
| Question | one line |
| Answer | the owner's answer, as read back and confirmed |
| Changes | which files or rules it affects |

A later answer that changes an earlier one is a new line that names the old one ("replaces 2026-11-12 #3").
Never edit the old line: the history is how a wrong answer gets found and undone.

## 5. Keep answers reversible
Code that follows from one answer is kept as one separate change (one commit), so it can be undone on its own if
the answer turns out wrong.
