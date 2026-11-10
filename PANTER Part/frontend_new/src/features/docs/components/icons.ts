// ไอคอนเส้นบนกริด 24x24 (วาดเอง ไม่พึ่งไลบรารี)
export const ICONS = {
  monitor: "M3 5h18v11H3z M8 20h8 M12 16v4",
  server: "M4 4h16v6H4z M4 14h16v6H4z M8 7h.01 M8 17h.01",
  database: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  file: "M6 3h8l4 4v14H6z M14 3v4h4",
  folder: "M3 6h6l2 2h10v11H3z",
  cpu: "M7 7h10v10H7z M10 10h4v4h-4z M9 3v4 M15 3v4 M9 17v4 M15 17v4 M3 9h4 M3 15h4 M17 9h4 M17 15h4",
  layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5",
  plug: "M9 3v5 M15 3v5 M6 8h12v4a6 6 0 01-12 0z M12 18v3",
  upload: "M12 16V4 M7 9l5-5 5 5 M4 20h16",
  table: "M3 5h18v14H3z M3 10h18 M9 5v14",
  check: "M5 12l5 5 9-10",
  alert: "M12 3l10 18H2z M12 10v5 M12 18h.01",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18z M12 7v5l3 2",
  xcircle: "M12 3a9 9 0 100 18 9 9 0 000-18z M9 9l6 6 M15 9l-6 6",
} as const;

export type IconName = keyof typeof ICONS;
