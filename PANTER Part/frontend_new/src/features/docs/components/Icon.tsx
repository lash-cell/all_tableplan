const PATHS = {
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  play: "M8 5l11 7-11 7z",
  grid: "M6 4h12a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z M3 10h18 M9 4v17",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  lock: "M7 11h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z M8 11V8a4 4 0 0 1 8 0v3",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2",
  warn: "M12 3l10 18H2z M12 10v4 M12 17.5v.01",
  user: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M4 21c0-4 4-6 8-6s8 2 8 6",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z M4 19V5",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4",
} as const;

export type IconName = keyof typeof PATHS;

interface Props { name: IconName; size?: number; strokeWidth?: number; className?: string }

/** ไอคอนเส้นบนกริด 24x24 (ตัวตกแต่ง: ซ่อนจาก screen reader เสมอ ข้อความกำกับต้องอยู่ข้างๆ) */
export function Icon({ name, size = 24, strokeWidth = 1.8, className }: Props) {
  return (
    <svg
      className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}