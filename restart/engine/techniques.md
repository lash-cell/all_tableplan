# Scheduling techniques: what exists, who uses it, how to choose

> Read when: choosing or changing the engine's method. Decision: A (backtracking build) then D (local search
> improvement). Only section 3 is needed to apply it; sections 1-2 are the reasons.

For agents choosing or changing the engine's method. The design itself is in engine/README.md. Researched 2026-11-09;
sources at the end. School timetabling is NP-hard (Timefold docs), so no method is fast on every input.

## 1. The six families

| # | Family | Idea in one line | Real use case |
|---|---|---|---|
| A | Backtracking search + CSP heuristics | build the timetable step by step; on a dead end, undo the last choice. MRV (fewest options first), forward checking (cut a branch as soon as something has no option left) | textbook method. The old plan's version of it placed the sample data in about 160k steps, 0.3 s (one block per course) |
| B | Heuristic repair ("recursive swapping") | place the hardest activity first; if no slot is free, take the slot with the fewest clashes and re-place the activities it pushed out, a limited number of levels deep | FET, the free school timetabler. Its notes say hardest-first ordering made it "maybe 10 times" faster. Earlier FET versions used a genetic algorithm, which was slower |
| C | Iterative forward search + conflict statistics | like B, but it remembers which assignments clashed before and avoids them | UniTime (Purdue University). Müller's solver built on it was the ITC 2007 winning entry, the same solver in all three tracks |
| D | Local search metaheuristics: simulated annealing, tabu search, late acceptance | start from a full timetable and keep making small changes (swap, move), keeping the ones that improve the score | Timefold (hard/soft score: hard rules always outweigh preferences). GOAL, the ITC 2011 high-school winner, was a hybrid local search |
| E | Exact solvers: constraint programming (CP-SAT), integer programming (MILP), MaxSAT/SMT | describe the rules as a model; a solver library searches it completely | OR-Tools CP-SAT ("interval" and "no overlap" fit lessons directly). Research models high-school timetabling as MaxSAT and SMT (Demirović and Musliu) |
| F | Genetic algorithms | breed a population of timetables | common in student projects. FET dropped it as slower. In a comparison of metaheuristics, none was best on every instance (Rossi-Doria et al.) |

## 2. What each family is good and bad at

| Need | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Finds a valid timetable fast at our size (~50 lessons, 55 slots per group) | yes, with good ordering | yes | yes | needs a start timetable | usually | slow |
| Can PROVE "impossible" (R 3.3) | yes, if it searched everything | no | no | no | yes | no |
| Improves quality by a score (R 4.7, 4.8) | no | no | partly | YES, its main job | yes (objective) | yes |
| Easy to explain to judges (R 4.2, 4.6) | yes | yes | medium | yes | the model yes, the solver is a black box | yes |
| Same input gives the same output | yes | yes | yes | only with a fixed seed | usually | only with a fixed seed |
| Needs a library | no | no | no | no | YES (a solver) | no |
| Adding a judge's surprise rule on the day | a new filter | a new clash type | a new clash type | a new score term (easiest) | a new model line | a new score term |

A method without a proof of impossibility may only say "search limit, not a proof", never "infeasible".

## 3. How to choose (for agents)

Answer in order. Stop at the first "yes".

1. Is the method for FINDING a first valid timetable?
   → A, built as in engine/README.md (day builder + constraint filters + lookahead). It's the only library-free method
     that can also prove "impossible".
2. Is it for IMPROVING a valid timetable (soft score, R 4.7/4.8 evidence)?
   → D: simulated annealing or late acceptance on the timetable from A, fixed seed, every move kept valid.
     Record the score after each round: that history is the R 4.8 graph.
3. Does A fail to find a timetable within its limits on real data, after the checks in engine/README.md were done?
   → First report the measurements. Then consider B (repair) as a second construction method, or E if the owner
     approves a solver library.
4. Anything else (genetic algorithm, machine learning, an LLM making the timetable)?
   → Don't. None beats A + D here, and an LLM can't guarantee the hard rules.

### The recommended combination
A then D, the same pattern Timefold uses and the competition winners resemble (construction, then local search). It
also maps straight onto the rubric's words:

```
 Plan (R 4.4)  ── analysis: arithmetic checks, "can this fit?"
 Act  (R 4.5)  ── A: build a valid timetable
 Evaluate (R 4.7) and improve (R 4.8) ── D: score it, improve it, show the score history
```

## 4. Already measured on this project's data (old plan, one-block model)
| Approach | Result |
|---|---|
| Decide the weekday of each course per group first, then place inside days | 0 of 25 day plans could staff period 1 |
| Fill a free grid, check the day rules at the end | 125k steps, 12 s, not one complete timetable |
| Raise the step limit after zero results | the same failure, slower |
| Random restarts with different seeds | 25 seeds gave about 5 different plans |
| Time-order build (A) with lookahead | placed, about 160k steps, 0.3 s |

## Caveats
- The details of FET, UniTime and Timefold are from their own documentation. GOAL's internal method beyond "hybrid
  local search" was not confirmed.
- The JavaScript solver libraries below were found but not tested: no versions, speed or maturity checked.

## Sources
- FET algorithm description: https://lalescu.ro/liviu/fet/doc/en/generation-algorithm-description.html
- FET algorithm notes (Debian copy): https://sources.debian.org/src/fet/7.0.8-3/doc/algorithm/algorithm-description.txt
- Müller, ITC 2007 solver description: https://www.eeecs.qub.ac.uk/itc2007/winner/bestcoursesolutions/Muller.pdf
- UniTime IFS demo (ICAPS 2007): https://icaps07-satellite.icaps-conference.org/demos/1/mms.pdf
- Timefold school timetabling constraints: https://docs.timefold.ai/timefold-solver/latest/quickstart/shared/school-timetabling/school-timetabling-constraints
- ITC 2011 results: https://www.utwente.nl/en/eemcs/dmmp/hstt/itc2011/results/ResultsITC2011.pdf
- GOAL solver paper: https://link.springer.com/10.1007/s10479-014-1685-4
- High-school timetabling as MaxSAT (Demirović, Musliu): https://dbai.tuwien.ac.at/user/demir/papers/Modeling%20High%20School%20Timetabling%20as%20Partial%20Weighted%20maxSAT%20-%20Demirovi%c4%87,%20Musliu.pdf
- Comparison of metaheuristics (Rossi-Doria et al.): https://research.manchester.ac.uk/en/publications/a-comparison-of-the-performance-of-different-metaheuristics-on-th/
- Comparative study for school timetables (RTU, 2025): https://ortus.rtu.lv/science/en/publications/41759
- Schaerf, survey of automated timetabling: https://ir.cwi.nl/pub/4935/4935D.pdf
- OR-Tools CP-SAT scheduling recipes: https://github.com/farao-community/or-tools/blob/stable/ortools/sat/doc/scheduling.md
- JavaScript solvers (untested): highs https://packages.ecosyste.ms/registries/npmjs.org/packages/highs ·
  glpk.js (GPL-3) https://www.npmjs.com/package/glpk.js · or-tools-wasm https://feedbagel.com/post/show-hn-solving-complex-optimization-problems-with-google-or-tools-in-browser
