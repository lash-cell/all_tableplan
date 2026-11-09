# Routes (what the screens call)

> Read when: connecting screens to the backend, or building the backend's routes. Every route answers JSON shaped as
> in shapes.md, except file upload and download. One program on 127.0.0.1; every path starts with /api.

Errors always look like `{error: {code, message}}`, the message in Thai:
bad_input 400 · not_found 404 · not_confirmed 409 · not_feasible 409 · ai_off 409 · busy 409 · too_large 413 ·
unsupported_file 415 · unreadable_file 422 · internal 500 (never with internal details).

| Screen | Method | Path | Sends | Gets back |
|---|---|---|---|---|
| all | GET | /api/health | | {ok, version} |
| Data | GET | /api/data | | Input data |
| Data | PUT | /api/data | Input data (edited in the form) | Input data, re-validated, `confirmed` back to no |
| Data | POST | /api/data/upload | the raw file; header X-File-Name (URL-encoded, for Thai names) | Match proposal |
| Data | POST | /api/data/paste | {section, year (courses only), text} (rows copied from a spreadsheet) | Match proposal |
| Data | POST | /api/data/match | the Match proposal, as corrected by the teacher | Input data (records added, `review` filled) |
| Data | GET | /api/data/template | | the upload template (.xlsx) |
| Data | GET | /api/data/guide | | {sections: list of {section, fields: list of {field, label, required, allowed}}} |
| Data | POST | /api/data/confirm | | Input data, confirmed · not_confirmed when `review` isn't empty |
| Data | POST | /api/ai/propose | {items: list of ReviewItem} | {proposals: list of {reviewItemId, field, value, guess}} · ai_off without a key |
| Generate (check) | POST | /api/check | | Analysis (works on unconfirmed data too) |
| Generate | POST | /api/runs | | Run (state "running") · not_confirmed · busy when a run is already working |
| Generate | GET | /api/runs/{id} | | Run. The screen asks every 0.5-1 s while state is "running" |
| Generate | POST | /api/runs/{id}/cancel | | Run (state "cancelled") |
| Results · Timetable | GET | /api/runs/{id}/view?kind=…&key=… | | View · not_feasible |
| Results · Report | POST | /api/runs/{id}/recheck | | Report (the checker run again, live) |
| Results · Run history | GET | /api/runs | | list of {id, createdAt, state, status, total score, items passed, chosen} |
| Results · Run history | GET | /api/runs/compare?a=…&b=… | | {a, b, dataChanges: list of text} with each run's status, score terms and items |
| Results · Run history | POST | /api/runs/{id}/choose | | Run (chosen yes; every other run no) |
| Settings | GET | /api/settings | | {provider, keySaved, aiOn} (never the key itself) |
| Settings | PUT | /api/settings | {provider, key} | {provider, keySaved, aiOn} |
| Settings | POST | /api/settings/test | | {works, message} |
| Settings | DELETE | /api/settings/key | | {keySaved: no, aiOn: no} |
| Results (bar) | GET | /api/runs/{id}/export.xlsx | | the .xlsx file · not_feasible |
| Results (bar) | GET | /api/runs/{id}/export.pdf | | the .pdf file · not_feasible |

Rules:
- Routes only translate. All logic lives in data/, engine/ and output/, so the routes can change without touching it.
- Upload limit 30 MB (too_large). Ids in paths are checked against the id pattern (shapes.md) before anything else.
- A screen never computes rules itself: pass and fail always come from the Report.
