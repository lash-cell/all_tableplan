// ข้อมูลจำลองสำหรับหน้าภาพรวม (ไม่ใช่ผลจากเอนจิน) — แทนด้วยข้อมูลจาก store/API เมื่อเชื่อมจริง
export type BlockKind = "general" | "theory" | "com" | "lab" | "act";

export interface TimetableBlock {
  day: number;      // 0 = จันทร์
  start: number;    // คาบเริ่ม (1-based)
  len: number;      // จำนวนคาบ
  kind: BlockKind;
  code: string;
  name: string;
  room: string;
  locked?: boolean; // ล็อกตามโจทย์
}

export const DAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์"] as const;
export const PERIODS = 11;
export const MAX_PERIOD = 9;      // ปวช.1 เรียนไม่เกินคาบ 9
export const LUNCH_PERIOD = 5;

export const KIND_TINT: Record<BlockKind, string> = {
  general: "lavender", theory: "butter", com: "mint", lab: "peach", act: "rose",
};

export const LEGEND: { tint: string; label: string }[] = [
  { tint: "lavender", label: "วิชาสามัญ" },
  { tint: "butter", label: "ทฤษฎีแผนก" },
  { tint: "mint", label: "ปฏิบัติ · COM" },
  { tint: "peach", label: "ปฏิบัติ · LAB" },
  { tint: "rose", label: "กิจกรรม/ลูกเสือ" },
  { tint: "slate", label: "พักกลางวัน" },
];

export const BLOCKS: TimetableBlock[] = [
  { day: 0, start: 1, len: 2, kind: "general", code: "20000-1101", name: "ภาษาไทยเพื่อการสื่อสาร", room: "ห้องเรียนภาษาไทย", locked: true },
  { day: 0, start: 3, len: 2, kind: "general", code: "20000-1201", name: "ภาษาอังกฤษเพื่อการสื่อสาร", room: "ห้องเรียนภาษาอังกฤษ", locked: true },
  { day: 0, start: 6, len: 4, kind: "com", code: "21909-1004", name: "พื้นฐานการวิเคราะห์ฯ", room: "COM1 · ครู C" },
  { day: 1, start: 1, len: 2, kind: "general", code: "20000-1401", name: "คณิตศาสตร์พื้นฐานอาชีพ", room: "ห้องเรียนคณิตศาสตร์", locked: true },
  { day: 1, start: 3, len: 2, kind: "general", code: "20000-1502", name: "ประวัติศาสตร์ชาติไทย", room: "ห้องเรียนสังคม", locked: true },
  { day: 1, start: 6, len: 2, kind: "general", code: "20000-1603", name: "พลศึกษาเพื่อพัฒนาสุขภาพ", room: "ห้องเรียนพลศึกษา", locked: true },
  { day: 2, start: 1, len: 4, kind: "lab", code: "21909-1001", name: "งานไฟฟ้าและอิเล็กทรอนิกส์ฯ", room: "LAB1 · ครู D" },
  { day: 2, start: 6, len: 4, kind: "com", code: "21909-1007", name: "การใช้งานระบบปฏิบัติการ", room: "COM2 · ครู E" },
  { day: 3, start: 1, len: 4, kind: "lab", code: "21909-1002", name: "อุปกรณ์อิเล็กทรอนิกส์ฯ", room: "LAB2 · ครู B" },
  { day: 3, start: 6, len: 2, kind: "act", code: "20000-2001", name: "กิจกรรมลูกเสือวิสามัญ 1", room: "แผนกวิชา", locked: true },
  { day: 4, start: 1, len: 4, kind: "com", code: "21909-2014", name: "ลีนุกซ์เบื้องต้น", room: "COM3 · ครู A" },
];

export const STATS: { tint: string; icon: "book" | "user" | "clock" | "warn"; value: number; label: string }[] = [
  { tint: "mint", icon: "book", value: 33, label: "รายวิชาที่นำเข้า" },
  { tint: "lavender", icon: "user", value: 5, label: "ครูผู้สอน" },
  { tint: "butter", icon: "clock", value: 159, label: "ชั่วโมงสอนรวม (คำนวณ)" },
  { tint: "rose", icon: "warn", value: 0, label: "ข้อขัดแย้ง" },
];