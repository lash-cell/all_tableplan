# Stack and forbid list

> Read when: setting up the project, adding a library, or tempted to add a feature. Key rule: anything not listed
> here needs the owner's approval first. Items marked "verify first" must be tested and reported before use.

## Stack: candidates (everything open source)
Rule: take the first choice. Switch to a backup only when a spike (below) fails, and write down why.
"Built in" means part of Node.js itself: nothing to install.

| Part | First choice | Backups | Licence | Notes |
|---|---|---|---|---|
| Language + runtime | Node.js, current LTS, plain JavaScript | Deno · Bun | MIT | owner decision: one language for everything |
| Address | 127.0.0.1, one port | | | localhost only: nobody else can reach it |
| Web server | built in (node:http) | Express 5 · Fastify | MIT | about 10 routes + serving the built screens: the built-in one is enough |
| Engine in the background | built in (worker threads) | a child process | MIT | the app stays responsive, a run can be cancelled, an engine crash can't stop the app. Listen for the worker's result, error AND exit; stop it at the time limit + 10 s. Proven: an unwatched worker error crashes the whole app |
| Storage | JSON files in a data folder, written safely (temp file, then rename) | node:sqlite (built in, but still "release candidate", not stable) · lowdb | | one user, small data: no database |
| Reading .xlsx | ExcelJS | SheetJS Community Edition · @protobi/exceljs (a maintained fork) | MIT · Apache-2.0 · MIT | ExcelJS's last official release is 4.4.0 (Oct 2023) and maintenance is inactive. SheetJS: take it from cdn.sheetjs.com, never the npm copy (stale 0.18.5, known security issue) |
| Writing .xlsx | ExcelJS | SheetJS Community Edition | MIT · Apache-2.0 | needs merged cells (a lesson spans its periods) |
| Writing PDF | decided by spike SP3 | pdfmake (on PDFKit) · Puppeteer (headless Chromium prints an HTML page) · LibreOffice (converts our .xlsx) | MIT · Apache-2.0 · MPL-2.0 | pdfmake is light, but its Thai shaping is unverified. Chromium shapes Thai correctly but is a big download. LibreOffice was seen rendering Thai correctly, but needs scale-to-page and a big install |
| Font for PDF | Sarabun | IBM Plex Sans Thai · Noto Sans Thai Looped | OFL | must have Thai AND Latin. Never Noto Sans Thai alone: it has no Latin, so course codes vanish |
| Tests | built in (node:test) | Vitest · Mocha | MIT | |
| Screens (the partner's choice) | React + Vite | Preact + Vite · plain HTML + Alpine.js | MIT | built once, then served by our program |
| Score graph | plain SVG | Chart.js · uPlot | MIT | one line chart doesn't need a library |
| AI assistant (optional, off by default) | Groq free tier, running an open-weights model | Gemini API free tier · OpenRouter free models | the models are open-weights; the services are not open source | the dev laptop (i7-3612QM) can't run a model locally. Free tiers are capped and change often (Groq: per-model limits around 1,000 requests a day; OpenRouter free: about 50 a day). We need a few calls per upload. Needs internet; without it, the ladder's other rungs do the job |

## Spikes: short tests that decide before building
| # | Test | Pass when | If it fails |
|---|---|---|---|
| SP1 | read base/data.xlsx and its reversed-columns copy with ExcelJS | every cell comes out as plain text, merged headings included | SheetJS Community Edition |
| SP2 | write a 5 × 11 grid with merged cells and Thai text with ExcelJS | it opens in LibreOffice and Excel, Thai intact | SheetJS Community Edition |
| SP3 | make one PDF page with pdfmake + Sarabun, containing "ปฏิบัติการคอมพิวเตอร์ 20000-1101 ที่ นี่ ผู้ ฟุ้ง" | as an image: every vowel and tone mark in place, Latin visible | Puppeteer, then LibreOffice |
| SP4 | a worker running a 60 s busy loop; the app answers within 50 ms; cancel stops it | both true | a child process |
| SP5 (only if AI is wanted) | the free API turns a Thai sentence ("ครู B สอนไม่ได้วันศุกร์เช้า") into a proposed unavailable time, and matches a header like "ชม./สัปดาห์" | correct, with the guess flagged, under 10 s | the next free API; if all fail, drop AI: nothing else depends on it |

The API key belongs to the USER, not the project. The user enters it on the Settings screen (app/screens.md); it is
saved in the data folder, which is in the ignore list, so it is never committed or uploaded. The code holds no key.
The key is sent only to the provider the user picked, and never shown in full again (masked after saving).

Each spike: under an hour, its result written down before any building starts.

## Forbid list
| Never | Why |
|---|---|
| hard-coding the sample data (sheet names, course codes, teacher names, row numbers) | the judges bring different data |
| a second server, a database, login, or access from other devices | one teacher, one computer, offline on the day |
| any outgoing internet call except the optional AI assistant | the app must work with the network off; the AI is the one switchable exception |
| using AI output without the teacher confirming it | AI can misread; a wrong rule silently breaks the timetable |
| the engine checking its own timetable | the checker is separate, or one bug hides in both |
| calling "search limit" "infeasible" | only a complete search or the analysis proves impossible |
| showing or exporting a timetable the checker hasn't passed | every view comes from the one checked result |
| randomness without a fixed, stored seed | same input, same timetable |
| splitting a course into several blocks | G9, R 1.7 |
| the measured failures in engine/techniques.md, section 4 | they failed on this data |
| genetic algorithms, machine learning or an LLM building the timetable | none beats build-then-improve here, and none guarantees the hard rules |
| a new library without approval | each one is a risk on an offline machine |
| Python or TypeScript | owner decision: one language, plain JavaScript |

## Later (not forbidden, just not now)
| Item | When |
|---|---|
| .csv, .xls, PDF and scanned-PDF import | after the whole flow works with .xlsx |
| editing the timetable by hand, with an instant re-check | after the demo flow is rehearsed |
| locking some lessons and re-generating the rest | same; it would add value for R 4.9 |
| room capacity (H13) | when the data has room sizes and group sizes |
| a settings screen for rule interpretations | only if the judges' rules need it |
