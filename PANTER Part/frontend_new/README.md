# Timetable Maker — UI prototype

This folder contains a visual React + Vite prototype written in JavaScript. It uses sample timetable data and is
not connected to the planned server, ingest, SQLite storage, or scheduling engine. Do not treat its sample values
or simulated progress as real timetable results.

The authoritative requirements are in `../../restart/`:

- `README.md` and `tasks.md` define scope and task order.
- `stack.md` defines the approved technology and forbids TypeScript.
- `app/screens.md` and `app/routes.md` define the planned screens and API.
- `shapes.md` defines shared input and output contracts.
- `../Doc/DESIGN_SYSTEM.md` defines this prototype's visual system.

## Commands

```sh
npm install
npm run dev
npm run build
npm run lint
```

Keep the prototype honest: disable controls that do not have a real action, and label any simulated behavior.
Persistent application data belongs in the planned local server's `node:sqlite` database, not in browser
`localStorage` or JSON files.
